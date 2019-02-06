import helpers from '../lib/helpers';

describe('calcDelta', () => {
    it('returns a difference in email addresses', () => {
        let user1 = {
            id: 1,
            email: 'test@user.com',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        let user2 = {
            id: 1,
            email: 'test2@user.com',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        let exclude = ['id', 'created_at', 'updated_at'];
        let res = helpers.calcDelta(user1, user2, exclude, true);
        // console.log(res);
        expect(res[0].rhs).to.equal('test2@user.com');
        expect(res[0].lhs).to.equal('test@user.com');
    });

    it('returns a difference in null value', () => {
        let user1 = {
            id: 1,
            email: 'test@user.com',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        let user2 = {
            id: 1,
            email: 'test@user.com',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: true,
            reset_password_sent_at: null,
            account_completed: false
        };
        let exclude = ['id', 'created_at', 'updated_at'];
        let res = helpers.calcDelta(user1, user2, exclude, true);
        // console.log(res);
        expect(res[0].rhs).to.equal(true);
        expect(res[0].lhs).to.equal(null);
    });

    it('returns a difference in a boolean', () => {
        let user1 = {
            id: 1,
            email: 'test@user.com',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: false
        };
        let user2 = {
            id: 1,
            email: 'test@user.com',
            encrypted_password: '$2a$10$rNIOuy1pDl7bI5dTE.xMle/vcB51V2nJVpb/EBAwG4egXE42UfDMS',
            reset_password_token: null,
            reset_password_sent_at: null,
            account_completed: true
        };
        let exclude = ['id', 'created_at', 'updated_at'];
        let res = helpers.calcDelta(user1, user2, exclude, true);
        // console.log(res);
        expect(res[0].rhs).to.equal(true);
        expect(res[0].lhs).to.equal(false);
    });

    it('returns no difference in strings and numbers when strict is false', () => {
        let obj1 = {
            name: 'User',
            age: '18'
        };

        let obj2 = {
            name: 'User',
            age: 18
        };

        let res = helpers.calcDelta(obj1, obj2, [], false);
        // console.log(res);
        expect(res).to.equal(null);
    });

    it('returns a difference in strings and numbers when strict is true', () => {
        let obj1 = {
            name: 'User',
            age: '18'
        };

        let obj2 = {
            name: 'User',
            age: 18
        };

        let res = helpers.calcDelta(obj1, obj2, [], true);
        // console.log(res);
        expect(typeof(res[0].rhs)).to.equal('number');
        expect(typeof(res[0].lhs)).to.equal('string');
    });

    it('returns a difference in strings and decimals when strict is true', () => {
        let obj1 = {
            name: 'User',
            age: '18.1'
        };

        let obj2 = {
            name: 'User',
            age: 18.1
        };

        let res = helpers.calcDelta(obj1, obj2, [], true);
        // console.log(res);
        expect(typeof(res[0].rhs)).to.equal('number');
        expect(typeof(res[0].lhs)).to.equal('string');
    });

    it('returns no difference in strings and decimals when strict is false', () => {
        let obj1 = {
            name: 'User',
            age: '18.1'
        };

        let obj2 = {
            name: 'User',
            age: 18.1
        };

        let res = helpers.calcDelta(obj1, obj2, [], false);
        // console.log(res);
        expect(res).to.equal(null);
    });
});
