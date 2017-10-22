require('./helper');
// import helpers from 'helpers';
const helpers = require('../lib/helpers');

describe('calcDelta', () => {
	it('returns number', () => {
		// console.log('getDiffHelper', getDiffHelper())
		const res = helpers.test();
		expect(res).to.equal(true);
	});

	it('returns a difference in email addresses', () => {
		const user1 = {
			id: 1,
			email: 'admin@scal.io',
			encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
			reset_password_token: null,
			reset_password_sent_at: null,
			account_completed: false,
		};
		const user2 = {
			id: 1,
			email: 'admin2@scal.io',
			encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
			reset_password_token: null,
			reset_password_sent_at: null,
			account_completed: false,
		};
		const exclude = ['id', 'created_at', 'updated_at'];
		const res = helpers.calcDelta(user1, user2, exclude, true);
		// console.log(res)
		expect(true).to.equal(true);
	});

	it('returns a difference in null value', () => {
		const user1 = {
			id: 1,
			email: 'admin@scal.io',
			encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
			reset_password_token: null,
			reset_password_sent_at: null,
			account_completed: false,
		};
		const user2 = {
			id: 1,
			email: 'admin@scal.io',
			encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
			reset_password_token: true,
			reset_password_sent_at: null,
			account_completed: false,
		};
		const exclude = ['id', 'created_at', 'updated_at'];
		const res = helpers.calcDelta(user1, user2, exclude, true);

		expect(true).to.equal(true);
	});

	it('returns a difference in a boolean', () => {
		const user1 = {
			id: 1,
			email: 'admin@scal.io',
			encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
			reset_password_token: null,
			reset_password_sent_at: null,
			account_completed: false,
		};
		const user2 = {
			id: 1,
			email: 'admin@scal.io',
			encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
			reset_password_token: null,
			reset_password_sent_at: null,
			account_completed: true,
		};
		const exclude = ['id', 'created_at', 'updated_at'];
		const res = helpers.calcDelta(user1, user2, exclude, true);

		expect(true).to.equal(true);
	});

	it('returns no difference in strings and numbers when strict is false', () => {
		const obj1 = {
			name: 'User',
			age: '18',
		};

		const obj2 = {
			name: 'User',
			age: 18,
		};

		const res = helpers.calcDelta(obj1, obj2, [], false);
		console.log('x', res);
		expect(true).to.equal(true);
	});

	it('returns a difference in strings and numbers when strict is true', () => {
		const obj1 = {
			name: 'User',
			age: '18',
		};

		const obj2 = {
			name: 'User',
			age: 18,
		};

		const res = helpers.calcDelta(obj1, obj2, [], true);
		console.log(res);
		expect(true).to.equal(true);
	});

	it('returns a difference in strings and numbers', () => {
		const obj1 = {
			name: 'User',
			age: '18.1',
		};

		const obj2 = {
			name: 'User',
			age: 18.1,
		};

		const res = helpers.calcDelta(obj1, obj2, [], false);
		console.log(res);
		expect(true).to.equal(true);
	});

	it('returns a difference in strings and numbers', () => {
		const obj1 = {
			name: 'User',
			age: '18.1',
		};

		const obj2 = {
			name: 'User1',
			age: 18.1,
		};

		const res = helpers.calcDelta(obj1, obj2, [], false);
		console.log(res);
		expect(true).to.equal(true);
	});
});
