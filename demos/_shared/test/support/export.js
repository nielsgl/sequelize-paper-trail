const fs = require('fs');
const path = require('path');

const snapshotRoot =
	process.env.DB_SNAPSHOT_DIR ||
	path.resolve(__dirname, '../../../_artifacts/db-snapshots');

const sanitize = value =>
	String(value)
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, '_')
		.replace(/^_+|_+$/g, '');

const sortKeysDeep = value => {
	if (Array.isArray(value)) {
		return value.map(sortKeysDeep);
	}
	if (value && typeof value === 'object' && !(value instanceof Date)) {
		return Object.keys(value)
			.sort()
			.reduce((acc, key) => {
				acc[key] = sortKeysDeep(value[key]);
				return acc;
			}, {});
	}
	return value;
};

const normalizeDocument = document => {
	if (typeof document === 'string') {
		try {
			return JSON.parse(document);
		} catch (err) {
			return document;
		}
	}
	return document;
};

const isUuid = value =>
	typeof value === 'string' &&
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
		value,
	);

const serializeRevision = revision => {
	const plain = revision.get({ plain: true });
	const { id, createdAt, updatedAt, ...rest } = plain;
	return {
		...rest,
		documentId: isUuid(plain.documentId) ? '<uuid>' : plain.documentId,
		document: sortKeysDeep(normalizeDocument(plain.document)),
	};
};

const serializeRevisionChange = change => {
	const plain = change.get({ plain: true });
	const { id, createdAt, updatedAt, ...rest } = plain;
	return {
		...rest,
		document: sortKeysDeep(normalizeDocument(plain.document)),
		diff: sortKeysDeep(normalizeDocument(plain.diff)),
	};
};

const defaultNormalizer = row => {
	const plain = row.get({ plain: true });
	const { createdAt, updatedAt, deletedAt, ...rest } = plain;
	return sortKeysDeep(rest);
};

const sortRows = rows => {
	const sorted = [...rows];
	const getKey = row => {
		if (row && Object.prototype.hasOwnProperty.call(row, 'id')) {
			return `id:${row.id}`;
		}
		return JSON.stringify(row);
	};
	sorted.sort((a, b) => {
		const keyA = getKey(a);
		const keyB = getKey(b);
		return keyA.localeCompare(keyB);
	});
	return sorted;
};

const writeSnapshot = (demoName, testName, payload, index) => {
	const demoDir = path.join(snapshotRoot, sanitize(demoName));
	if (!fs.existsSync(demoDir)) {
		fs.mkdirSync(demoDir, { recursive: true });
	}
	const safeTest = sanitize(testName || 'unknown');
	const fileName = `${safeTest}_${index}.json`;
	const filePath = path.join(demoDir, fileName);
	fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
};

const exportSnapshot = async sequelize => {
	if (!process.env.EXPORT_DB_SNAPSHOT) {
		return;
	}

	const demoName = process.env.DEMO_NAME || 'unknown';
	const testName =
		(global.expect && expect.getState && expect.getState().currentTestName) ||
		'unknown';

	const models = sequelize.models || {};
	const payload = {};

	// Use consistent ordering for model names.
	const modelNames = Object.keys(models).sort();
	for (const modelName of modelNames) {
		const model = models[modelName];
		if (!model || typeof model.findAll !== 'function') {
			continue;
		}
		try {
			const rows = await model.findAll();
			let serialized = rows.map(defaultNormalizer);
			if (modelName === 'Revision') {
				serialized = rows.map(serializeRevision);
			} else if (modelName === 'RevisionChange') {
				serialized = rows.map(serializeRevisionChange);
			}
			payload[modelName] = sortRows(serialized);
		} catch (err) {
			payload[modelName] = {
				_error: err && err.message ? err.message : String(err),
			};
		}
	}

	if (!global.__dbSnapshotIndex) {
		global.__dbSnapshotIndex = 1;
	} else {
		global.__dbSnapshotIndex += 1;
	}

	writeSnapshot(demoName, testName, payload, global.__dbSnapshotIndex);
};

const attachSnapshotOnClose = sequelize => {
	if (!sequelize || sequelize.__snapshotWrapped) {
		return;
	}
	sequelize.__snapshotWrapped = true;
	const originalClose = sequelize.close.bind(sequelize);
	sequelize.close = async (...args) => {
		await exportSnapshot(sequelize);
		return originalClose(...args);
	};
};

module.exports = {
	attachSnapshotOnClose,
};
