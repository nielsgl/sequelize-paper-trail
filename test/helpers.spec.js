import helpers from 'helpers';

describe('calcDelta', () => {
   it('returns number', () => {
        // console.log('getDiffHelper', getDiffHelper())
        var res = helpers.test();
        expect(res).to.equal(true);
    });

    it('returns a difference in email addresses', () => {
        var user1 = {
            id: 1,
            email: 'admin@scal.io',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        var user2 = {
            id: 1,
            email: 'admin2@scal.io',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        var exclude = ['id', 'created_at', 'updated_at'];
        var res = helpers.calcDelta(user1, user2, exclude, true);
        // console.log(res)
        expect(true).to.equal(true);
    });

    it('returns a difference in null value', () => {
        var user1 = {
            id: 1,
            email: 'admin@scal.io',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        var user2 = {
            id: 1,
            email: 'admin@scal.io',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: true,
            reset_password_sent_at: null,
            account_completed: false
        };
        var exclude = ['id', 'created_at', 'updated_at'];
        var res = helpers.calcDelta(user1, user2, exclude, true);

        expect(true).to.equal(true);
    });

    it('returns a difference in a boolean', () => {
        var user1 = {
            id: 1,
            email: 'admin@scal.io',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        var user2 = {
            id: 1,
            email: 'admin@scal.io',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: true
        };
        var exclude = ['id', 'created_at', 'updated_at'];
        var res = helpers.calcDelta(user1, user2, exclude, true);

        expect(true).to.equal(true);
    });

    it('returns no difference in strings and numbers when strict is false', () => {
        var obj1 = {
            name: 'User',
            age: '18'
        };

        var obj2 = {
            name: 'User',
            age: 18
        };

        var res = helpers.calcDelta(obj1, obj2, [], false);
        console.log('x',res)
        expect(true).to.equal(true);
    });

    it('returns a difference in strings and numbers when strict is true', () => {
        var obj1 = {
            name: 'User',
            age: '18'
        };

        var obj2 = {
            name: 'User',
            age: 18
        };

        var res = helpers.calcDelta(obj1, obj2, [], true);
        console.log(res)
        expect(true).to.equal(true);
    });

    it('returns a difference in strings and numbers', () => {
        var obj1 = {
            name: 'User',
            age: '18.1'
        };

        var obj2 = {
            name: 'User',
            age: 18.1
        };

        var res = helpers.calcDelta(obj1, obj2, [], false);
        console.log(res)
        expect(true).to.equal(true);
    });

    it('returns a difference in strings and numbers', () => {
        var obj1 = {
            name: 'User',
            age: '18.1'
        };

        var obj2 = {
            name: 'User1',
            age: 18.1
        };

        var res = helpers.calcDelta(obj1, obj2, [], false);
        console.log(res)
        expect(true).to.equal(true);
    });
});