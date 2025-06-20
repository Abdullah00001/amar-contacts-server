import UserRepositories from '../../../../src/modules/user/user.repositories';
import User from '../../../../src/modules/user/user.models';

const { createNewUser, findUserByEmail, resetPassword, verifyUser } =
  UserRepositories;

jest.mock('../../../../src/modules/user/user.models');

describe('UserRepositories Unit Test', () => {
  describe('findUserByEmail', () => {
    it('it should be return a user object if the user found', async () => {
      const mockEmail = 'test@example.mail';
      const mockUser = { email: 'test@example.mail' };
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      const result = await findUserByEmail(mockEmail);
      expect(result).toBe(mockUser);
    });
    it('it should be return null if the user not found', async () => {
      const mockEmail = 'tes@xample.mail';
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const result = await findUserByEmail(mockEmail);
      expect(result).toBeNull();
    });
    it('it should be throw error', async () => {
      const mockEmail = 'test@example.mail';
      const databaseError = new Error('Database Error');
      jest.spyOn(User, 'findOne').mockRejectedValue(databaseError);
      await expect(() => findUserByEmail(mockEmail)).rejects.toThrow(
        'Database Error'
      );
    });
  });
});
