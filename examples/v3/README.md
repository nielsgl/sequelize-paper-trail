# Example (v3 legacy line)

This example targets the v3 support line (legacy/hotfix-only). It demonstrates all supported options and behavior in the v3 line, using an in-memory SQLite database.

## Prerequisites
- Node 20.20.0 (recommended) or active LTS >= 20
- npm
- Sequelize pinned to 5.14.0 for legacy compatibility (see `package.json`)

## Install & run
From the repo root, refresh the local tarball if needed:

```bash
npm pack --pack-destination examples/_artifacts
cp examples/_artifacts/sequelize-paper-trail-*.tgz examples/_artifacts/sequelize-paper-trail-local.tgz
```

Then run the example:

```bash
cd examples/v3
npm install
npm run start
```

## What this example covers
The `index.js` file runs a set of scenarios and prints results to the console. Each scenario is self-contained and uses a fresh in-memory database.

### 1) Basic lifecycle + revision changes
- Creates a model, enables `hasPaperTrail()`.
- Runs create -> update -> destroy.
- Prints `Revision` and `RevisionChange` entries.

### 2) User tracking via CLS
- Uses `cls-hooked` and `continuationNamespace` with a user model.
- Writes with `userId` stored in CLS context.

### 3) Metadata fields (`metaDataFields`)
- Uses required + optional metadata.
- Demonstrates validation errors when required metadata is missing.
- Shows that metadata fields are not persisted by default in v3.

### 4) `noPaperTrail`
- Demonstrates current v3 behavior: `noPaperTrail` does **not** suppress revisions on update.
- Included for compatibility (see tests for current expected behavior).

### 5) Compression + strict diff
- Enables `enableCompression` and `enableStrictDiff`.
- Shows diff behavior for string/number changes.

### 6) Custom schema options
- Uses `underscored`, `underscoredAttributes`, `tableName`, and `revisionAttribute`.
- Prints the resulting revision table name.

### 7) UUID identifiers
- Enables `UUID` for Revision/RevisionChange identifiers.
- Logs the resulting attribute types.

### 8) `enableMigration`
- Demonstrates auto-adding `revisionAttribute` via `enableMigration`.

## Expected output (abridged)

```text
==============================
Basic lifecycle + revision changes
==============================
revisions: [ ... ]
revision changes: [ ... ]

==============================
User tracking via CLS (cls-hooked)
==============================
revisions (cls userId): [ 1, 1 ]

==============================
Metadata fields (required + optional)
==============================
expected error (missing requestId): Cannot read properties of undefined (reading 'requestId')
revisions requestId (expected undefined by default): [ undefined ]

==============================
noPaperTrail option (behavior in v3 line)
==============================
revision count (expected 3; noPaperTrail does not suppress in v3): 3

==============================
Compression + strict diff behavior
==============================
compressed documents: [ { value: '3.14', numberValue: 314 }, { value: 3.14 } ]

==============================
Custom schema options (underscored + tableName + revisionAttribute)
==============================
revision table name: audit_revisions

==============================
UUID revision identifiers
==============================
Revision id type: UUID
RevisionChange id type: UUID

==============================
enableMigration (auto-add revisionAttribute)
==============================
revision column exists: true
```

## Full code (index.js)

```javascript
const { Sequelize, DataTypes } = require('sequelize');
const cls = require('cls-hooked');
const PaperTrail = require('sequelize-paper-trail');

process.env.SEQUELIZE_CLS = 'cls-hooked';

const createSequelize = () =>
	new Sequelize({
		dialect: 'sqlite',
		storage: ':memory:',
		logging: false,
	});

const defaultPaperTrailOptions = {
	defaultAttributes: { documentId: 'documentId', revisionId: 'RevisionId' },
};

const logSection = title => {
	console.log('\n==============================');
	console.log(title);
	console.log('==============================');
};

const fetchRevisions = async sequelize => {
	const { Revision, RevisionChange } = sequelize.models;
	const revisions = Revision
		? await Revision.findAll({ order: [['id', 'ASC']] })
		: [];
	const changes = RevisionChange
		? await RevisionChange.findAll({ order: [['id', 'ASC']] })
		: [];
	return {
		revisions: revisions.map(r => r.get({ plain: true })),
		changes: changes.map(c => c.get({ plain: true })),
	};
};

const waitForColumn = async (queryInterface, tableName, columnName) => {
	const start = Date.now();
	while (Date.now() - start < 2000) {
		// eslint-disable-next-line no-await-in-loop
		const columns = await queryInterface.describeTable(tableName);
		if (columns[columnName]) {
			return true;
		}
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => {
			setTimeout(resolve, 50);
		});
	}
	return false;
};

const scenarioBasicLifecycle = async () => {
	logSection('Basic lifecycle + revision changes');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		enableRevisionChangeModel: true,
		continuationKey: 'userId',
	});
	paperTrail.defineModels();

	const User = sequelize.define('User', {
		name: DataTypes.STRING,
		role: DataTypes.STRING,
	});
	User.hasPaperTrail();

	await sequelize.sync({ force: true });

	const user = await User.create(
		{ name: 'Alice', role: 'admin' },
		{ userId: 'example-user' },
	);
	await user.update({ role: 'editor' }, { userId: 'example-user' });
	await user.destroy({ userId: 'example-user' });

	const { revisions, changes } = await fetchRevisions(sequelize);
	console.log('revisions:', revisions);
	console.log('revision changes:', changes);

	await sequelize.close();
};

const scenarioUserTrackingCLS = async () => {
	logSection('User tracking via CLS (cls-hooked)');
	const namespace = cls.createNamespace('paper-trail');
	const sequelize = createSequelize();
	const Account = sequelize.define('Account', {
		name: DataTypes.STRING,
	});
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		userModel: 'Account',
		continuationNamespace: 'paper-trail',
		continuationKey: 'userId',
		belongsToUserOptions: { foreignKey: 'userId' },
	});
	paperTrail.defineModels();

	const Task = sequelize.define('Task', {
		name: DataTypes.STRING,
		status: DataTypes.STRING,
	});
	Task.hasPaperTrail();

	await sequelize.sync({ force: true });

	const account = await Account.create({ name: 'CLS User' });

	await new Promise((resolve, reject) => {
		namespace.run(async () => {
			try {
				namespace.set('userId', account.id);
				const task = await Task.create({ name: 'Setup', status: 'todo' });
				await task.update({ status: 'done' });
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	});

	const { revisions } = await fetchRevisions(sequelize);
	console.log('revisions (cls userId):', revisions.map(r => r.userId));

	await sequelize.close();
};

const scenarioMetaDataFields = async () => {
	logSection('Metadata fields (required + optional)');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		metaDataFields: { requestId: true, ip: false },
		metaDataContinuationKey: 'metaData',
		continuationKey: 'userId',
	});
	paperTrail.defineModels();

	const Order = sequelize.define('Order', {
		total: DataTypes.INTEGER,
	});
	Order.hasPaperTrail();

	await sequelize.sync({ force: true });

	// Required metadata provided via options.
	await Order.create(
		{ total: 100 },
		{ userId: 'meta-user', metaData: { requestId: 'req-1', ip: '127.0.0.1' } },
	);

	// Missing required metadata should throw.
	try {
		await Order.create({ total: 50 }, { userId: 'meta-user' });
	} catch (err) {
		console.log('expected error (missing requestId):', err.message);
	}

	const { revisions } = await fetchRevisions(sequelize);
	console.log(
		'revisions requestId (expected undefined by default):',
		revisions.map(r => r.requestId),
	);

	await sequelize.close();
};

const scenarioNoPaperTrail = async () => {
	logSection('noPaperTrail option (behavior in v3 line)');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		continuationKey: 'userId',
	});
	paperTrail.defineModels();

	const Widget = sequelize.define('Widget', {
		name: DataTypes.STRING,
	});
	Widget.hasPaperTrail();

	await sequelize.sync({ force: true });

	const widget = await Widget.create({ name: 'alpha' }, { userId: 'skip-user' });
	await widget.update({ name: 'beta' }, { userId: 'skip-user', noPaperTrail: true });
	await widget.update({ name: 'gamma' }, { userId: 'skip-user' });

	const { revisions } = await fetchRevisions(sequelize);
	console.log(
		'revision count (expected 3; noPaperTrail does not suppress in v3):',
		revisions.length,
	);

	await sequelize.close();
};

const scenarioCompressionStrictDiff = async () => {
	logSection('Compression + strict diff behavior');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		enableCompression: true,
		enableStrictDiff: true,
	});
	paperTrail.defineModels();

	const Sample = sequelize.define('Sample', {
		value: DataTypes.STRING,
		numberValue: DataTypes.INTEGER,
	});
	Sample.hasPaperTrail();

	await sequelize.sync({ force: true });

	const sample = await Sample.create({ value: '3.14', numberValue: 314 });
	await sample.update({ value: 3.14, numberValue: 314 });

	const { revisions } = await fetchRevisions(sequelize);
	console.log('compressed documents:', revisions.map(r => r.document));

	await sequelize.close();
};

const scenarioCustomSchema = async () => {
	logSection('Custom schema options (underscored + tableName + revisionAttribute)');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		underscored: true,
		underscoredAttributes: true,
		tableName: 'audit_revisions',
		revisionAttribute: 'rev',
	});
	paperTrail.defineModels();

	const Invoice = sequelize.define('Invoice', {
		total: DataTypes.INTEGER,
	}, { underscored: true });
	Invoice.hasPaperTrail();

	await sequelize.sync({ force: true });

	const invoice = await Invoice.create({ total: 10 });
	await invoice.update({ total: 20 });

	const revisionTable = sequelize.models.Revision.getTableName();
	console.log('revision table name:', revisionTable);

	await sequelize.close();
};

const scenarioUUID = async () => {
	logSection('UUID revision identifiers');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		enableRevisionChangeModel: true,
		UUID: true,
	});
	paperTrail.defineModels();

	const Device = sequelize.define('Device', {
		name: DataTypes.STRING,
	});
	Device.hasPaperTrail();

	await sequelize.sync({ force: true });

	const { Revision, RevisionChange } = sequelize.models;
	console.log('Revision id type:', Revision.rawAttributes.id.type.key);
	console.log('RevisionChange id type:', RevisionChange.rawAttributes.id.type.key);

	await sequelize.close();
};

const scenarioEnableMigration = async () => {
	logSection('enableMigration (auto-add revisionAttribute)');
	const sequelize = createSequelize();
	const paperTrail = PaperTrail.init(sequelize, {
		...defaultPaperTrailOptions,
		enableMigration: true,
		revisionAttribute: 'revision',
	});
	paperTrail.defineModels();

	const Product = sequelize.define('Product', {
		name: DataTypes.STRING,
	});
	const queryInterface = sequelize.getQueryInterface();

	await queryInterface.createTable('Products', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
	});

	Product.hasPaperTrail();

	const added = await waitForColumn(queryInterface, 'Products', 'revision');
	console.log('revision column exists:', added);

	await sequelize.close();
};

const run = async () => {
	await scenarioBasicLifecycle();
	await scenarioUserTrackingCLS();
	await scenarioMetaDataFields();
	await scenarioNoPaperTrail();
	await scenarioCompressionStrictDiff();
	await scenarioCustomSchema();
	await scenarioUUID();
	await scenarioEnableMigration();
};

run().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
```
