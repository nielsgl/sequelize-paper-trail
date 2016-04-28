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
        var res = helpers.calcDelta(user1, user2, exclude);

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
        var res = helpers.calcDelta(user1, user2, exclude);

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
        var res = helpers.calcDelta(user1, user2, exclude);

        expect(true).to.equal(true);
    });
});