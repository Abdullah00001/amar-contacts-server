import UserRepositories from '@/modules/user/user.repositories';
import IUser, { IUserPayload } from '@/modules/user/user.interfaces';
import { generate } from 'otp-generator';
import redisClient from '@/configs/redis.configs';
import { otpExpireAt } from '@/const';
import sendVerificationEmail from '@/utils/sendVerificationEmail.utils';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt.utils';
import { Types } from 'mongoose';

const { createNewUser, verifyUser } = UserRepositories;

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
  processVerifyUser: async ({ email }: IUserPayload): Promise<IUserPayload> => {
    try {
      const user = await verifyUser({ email });
      const accessToken = generateAccessToken({
        email: user?.email!,
        userId: user?._id! as Types.ObjectId,
        isVerified: user?.isVerified!,
        name: user?.name!,
      });
      const refreshToken = generateRefreshToken({
        email: user?.email!,
        userId: user?._id! as Types.ObjectId,
        isVerified: user?.isVerified!,
        name: user?.name!,
      });
      return { accessToken: accessToken!, refreshToken: refreshToken! };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Verify Service');
      }
    }
  },
  processLogin: (payload: IUser): IUserPayload => {
    const { email, isVerified, id, name } = payload;
    const accessToken = generateAccessToken({
      email,
      isVerified,
      userId: id,
      name,
    });
    const refreshToken = generateRefreshToken({
      email,
      isVerified,
      userId: id,
      name,
    });

    return {
      accessToken: accessToken!,
      refreshToken: refreshToken!,
    };
  },
};

export default UserServices;
