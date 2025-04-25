import User from './user.models';

const UserRepositories = {
  findUserByEmailOrPhone: async (payload: string) => {
    try {
      const isEmail = payload.includes('@');
      const query = isEmail ? { email: payload } : { phone: payload };
      const foundedUser = await User.findOne(query);
      if (!foundedUser) return null;
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Operation');
      }
    }
  },
};

export default UserRepositories;
