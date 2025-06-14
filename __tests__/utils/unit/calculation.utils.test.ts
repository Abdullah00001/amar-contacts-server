import CalculationUtils from '../../../src/utils/calculation.utils';

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
  
});
