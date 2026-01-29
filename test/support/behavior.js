const getModelRevisions = async (Revision, modelName) =>
	Revision.findAll({
		where: { model: modelName },
		order: [['revision', 'ASC']],
	});

const waitForColumn = async (queryInterface, tableName, columnName) => {
	const start = Date.now();
	while (Date.now() - start < 2000) {
		// eslint-disable-next-line no-await-in-loop
		const columns = await queryInterface.describeTable(tableName);
		if (columns[columnName]) {
			return true;
		}
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => setTimeout(resolve, 50));
	}
	return false;
};

module.exports = {
	getModelRevisions,
	waitForColumn,
};
