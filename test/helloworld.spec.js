import app from 'helloworld';

describe('app', () => {
  it('returns string', () => {
      expect(typeof(app())).to.equal('string');
    });
});
