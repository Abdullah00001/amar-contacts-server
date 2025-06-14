import CookieUtils from '../../../src/utils/cookie.utils';

const { cookieOption, sharedCookieOption } = CookieUtils;

describe('CookieUtils', () => {
  describe('cookieOption method should be take string as format "ms","s","m","h","d" and return cookie option object base on ENVIRONMENT', () => {
    it('it should take 1ms and return cookie option with max age 1 ms', () => {
      const result = cookieOption('1ms');
      expect(result.maxAge).toBe(1);
    });
    it('it should take 1s and return cookie option with max age 1 s', () => {
      const result = cookieOption('1s');
      expect(result.maxAge).toBe(1 * 1000);
    });
    it('it should take 1m and return cookie option with max age 1 m', () => {
      const result = cookieOption('1m');
      expect(result.maxAge).toBe(1 * 60 * 1000);
    });
    it('it should take 1h and return cookie option with max age 1 h', () => {
      const result = cookieOption('1h');
      expect(result.maxAge).toBe(1 * 60 * 60 * 1000);
    });
    it('it should take 1d and return cookie option with max age 1 d', () => {
      const result = cookieOption('1d');
      expect(result.maxAge).toBe(1 * 24 * 60 * 60 * 1000);
    });
    it('it should take 1dd and throw error', () => {
      expect(() => cookieOption('1dd')).toThrow('Invalid expiresIn format');
    });
  });
  describe('sharedCookieOption should return an object for shared cookies base on ENVIRONMENT', () => {
    it('it should be return an object', () => {
      const result = sharedCookieOption();
      expect(typeof result).toBe('object');
    });
  });
});
