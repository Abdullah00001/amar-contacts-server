import UserRepositories from '@/modules/user/user.repositories';
import { IUserPayload } from '@/modules/user/user.interfaces';
import { generate } from 'otp-generator';
import redisClient from '@/configs/redis.configs';
import { otpExpireAt } from '@/const';
import sendVerificationEmail from '@/utils/sendVerificationEmail.utils';

const { createNewUser } = UserRepositories;

const UserServices = {
  processSignup: async (payload: IUserPayload) => {
    try {
      const createdUser = await createNewUser(payload);
      const otp = generate(6, { digits: true });
      await Promise.all([
        redisClient.set(
          `user:otp:${createdUser?._id}`,
          otp,
          'EX',
          otpExpireAt * 60
        ),
        sendVerificationEmail({
          email: createdUser?.email,
          expirationTime: otpExpireAt,
          name: createdUser?.name,
          otp,
        }),
      ]);
      return createdUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Signup Service');
      }
    }
  },
};

export default UserServices;
