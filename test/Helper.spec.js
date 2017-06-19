import H from '../src/lib/Helper/Helper';

describe('Helper Class', () => {
  describe('#equals()', () => {
    it('should return true when both of the parameters are equal', () => {
      assert.equal(H.equals(1, 1), true);
    });
  });
});
