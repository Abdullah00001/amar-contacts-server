import CalculationUtils from '../../../src/utils/calculation.utils';
import crypto from 'crypto';

const {
  calculateMilliseconds,
  expiresInTimeUnitToMs,
  generateEtag,
  stringToNumber,
} = CalculationUtils;

describe('Unit Test - CalculationUtils', () => {
  describe('calculateMilliseconds', () => {
    it('it should be return number in millisecond', () => {
      const result = calculateMilliseconds(1, 'millisecond');
      expect(result).toBe(1);
    });
    it('it should be take number in second and return in millisecond', () => {
      const result = calculateMilliseconds(1, 'second');
      expect(result).toBe(1 * 1000);
    });
    it('it should be take number in minutes and return in millisecond', () => {
      const result = calculateMilliseconds(1, 'minutes');
      expect(result).toBe(1 * 60 * 1000);
    });
    it('it should be take number in hour and return in millisecond', () => {
      const result = calculateMilliseconds(1, 'hour');
      expect(result).toBe(1 * 60 * 60 * 1000);
    });
    it('it should be take number in day and return in millisecond', () => {
      const result = calculateMilliseconds(1, 'day');
      expect(result).toBe(1 * 24 * 60 * 60 * 1000);
    });
    it('it should be take number but with wrong unit and return NaN', () => {
      const result = calculateMilliseconds(1, 'daay');
      expect(result).toBe(NaN);
    });
  });
  describe('stringToNumber', () => {
    it('it should be take a string like 5d and return the number', () => {
      const result = stringToNumber('5d');
      expect(result).toBe(5);
    });
  });
  describe('expiresInTimeUnitToMs', () => {
    it('it should be return 1ms to 1 millisecond', () => {
      const result = expiresInTimeUnitToMs('1ms');
      expect(result).toBe(1);
    });
    it('it should be accept 1s and return in millisecond', () => {
      const result = expiresInTimeUnitToMs('1s');
      expect(result).toBe(1 * 1000);
    });
    it('it should be accept 1m and return in millisecond', () => {
      const result = expiresInTimeUnitToMs('1m');
      expect(result).toBe(1 * 60 * 1000);
    });
    it('it should be accept 1h and return in millisecond', () => {
      const result = expiresInTimeUnitToMs('1h');
      expect(result).toBe(1 * 60 * 60 * 1000);
    });
    it('it should be accept 1d and return in millisecond', () => {
      const result = expiresInTimeUnitToMs('1d');
      expect(result).toBe(1 * 24 * 60 * 60 * 1000);
    });
    it('it should be take 1dd ad invalid time unit and throw error', () => {
      expect(() => expiresInTimeUnitToMs('1dd')).toThrow(
        'Invalid expiresIn format'
      );
    });
  });
  describe('generateEtag', () => {
    it('it should be take json and return string', () => {
      const mockJson = {
        id: 'u12345',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        isActive: true,
        roles: ['user', 'admin'],
        createdAt: '2025-06-14T15:30:00Z',
      };
      const hashed = crypto
        .createHash('md5')
        .update(JSON.stringify(mockJson))
        .digest('hex');
      const result = generateEtag(mockJson);
      expect(typeof result).toBe('string');
      expect(result).toBe(hashed);
    });
  });
});
