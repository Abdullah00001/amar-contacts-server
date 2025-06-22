import PasswordUtils from '../../../src/utils/password.utils';
import logger from '../../../src/configs/logger.configs';
import bcrypt from 'bcrypt';

const { comparePassword, hashPassword } = PasswordUtils;

const mockPassword = '1bgH7@#09lk.,hy4poi5';
const mockInvalidPassword = '1bgH7@#09lk.--,hy4poi5';
const mockHashPassword = (async () =>
  (await hashPassword(mockPassword)) as string)();

jest.mock('../../../src/configs/logger.configs');

describe('PasswordUtils', () => {
  describe('hashPassword', () => {
    it('it should be hash the password and return an string', async () => {
      const result = await hashPassword(mockPassword);
      expect(typeof result).toBe('string');
    });
    it('it should br return null when hashing will be failed', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockRejectedValue(new Error('Hash failed') as unknown as never);
      const result = await hashPassword('error-password');
      expect(result).toBeNull();
    });
  });

  describe('comparePassword', () => {
    it('it should be compare the password and return true if password match', async () => {
      const result = await comparePassword(
        mockPassword,
        await mockHashPassword
      );
      expect(result).toBe(true);
    });
    it('it should be compare the password and return false if password not match', async () => {
      const result = await comparePassword(
        mockInvalidPassword,
        await mockHashPassword
      );
      expect(result).toBe(false);
    });
    it('should return null if comparison throws an error', async () => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockRejectedValue(new Error('Compare failed') as unknown as never);
      const result = await comparePassword('test', 'wrong');
      expect(result).toBeNull();
    });
  });
});
