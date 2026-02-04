beforeAll(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterAll(() => {
	if (console.log.mockRestore) {
		console.log.mockRestore();
	}
});
