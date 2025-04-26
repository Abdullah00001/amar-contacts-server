import User from '../../../src/modules/user/user.models';
import UserRepositories from '../../../src/modules/user/user.repositories';
const { findUserByEmailOrPhone } = UserRepositories;
jest.mock('../../../src/modules/user/user.models');

describe('User Repositories', () => {
  describe('Find User By Email Or Phone', () => {
    it('It Should Be Return Object, If The User Found With Email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: 'example@gmail.com',
      });
      const result = await findUserByEmailOrPhone('example@gmail.com');
      expect(result).toEqual({
        email: 'example@gmail.com',
      });
    });
    it('It Should Be Return Object, If The User Found With Phone', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        phone: '01937868838',
      });
      const result = await findUserByEmailOrPhone('01937868838');
      expect(result).toEqual({ phone: '01937868838' });
    });
    it('It Should Be Return Null, If The User Not Found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const result = await findUserByEmailOrPhone('thxdhxt');
      expect(result).toBeNull();
    });
    it('It Should Throw Error If Something Goes Wrong', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(findUserByEmailOrPhone('error@gmail.com')).rejects.toThrow(
        'DB Error'
      );
    });
  });
});
