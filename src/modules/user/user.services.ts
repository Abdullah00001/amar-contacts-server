import UserRepositories from '@/modules/user/user.repositories';
import IUser, { IUserPayload } from '@/modules/user/user.interfaces';
import { generate } from 'otp-generator';
import redisClient from '@/configs/redis.configs';
import {
  accessTokenBlackListExpAt,
  otpExpireAt,
  refreshTokenBlackListExpAt,
} from '@/const';
import sendVerificationEmail from '@/utils/sendVerificationEmail.utils';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt.utils';
import { Types } from 'mongoose';
import { IRefreshTokenPayload } from '@/interfaces/jwtPayload.interfaces';
import CalculationUtils from '@/utils/calculation.utils';

const { createNewUser, verifyUser, findUserByEmail } = UserRepositories;
const { calculateMilliseconds } = CalculationUtils;

const UserServices = {
  processSignup: async (payload: IUserPayload) => {
    try {
      const createdUser = await createNewUser(payload);
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
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
  processTokens: async (
    payload: IRefreshTokenPayload
  ): Promise<IUserPayload> => {
    const { email, refreshToken } = payload;
    const user = await findUserByEmail(email);
    const newAccessToken = generateAccessToken({
      email: user?.email as string,
      isVerified: user?.isVerified as boolean,
      userId: user?._id as Types.ObjectId,
      name: user?.name as string,
    }) as string;

    const newRefreshToken = generateRefreshToken({
      email: user?.email as string,
      isVerified: user?.isVerified as boolean,
      userId: user?._id as Types.ObjectId,
      name: user?.name as string,
    }) as string;
    await redisClient.set(
      `blacklist:refreshToken:${user?._id}`,
      refreshToken,
      'EX',
      calculateMilliseconds(refreshTokenBlackListExpAt, 'milliseconds')
    );
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
  processVerifyUser: async ({ email }: IUserPayload): Promise<IUserPayload> => {
    try {
      const user = await verifyUser({ email });
      const accessToken = generateAccessToken({
        email: user?.email as string,
        isVerified: user?.isVerified as boolean,
        userId: user?._id as Types.ObjectId,
        name: user?.name as string,
      });
      const refreshToken = generateRefreshToken({
        email: user?.email as string,
        isVerified: user?.isVerified as boolean,
        userId: user?._id as Types.ObjectId,
        name: user?.name as string,
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
  processResend: async ({ email, name, _id }: IUser) => {
    try {
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await Promise.all([
        redisClient.set(`user:otp:${_id}`, otp, 'EX', otpExpireAt * 60),
        sendVerificationEmail({
          email: email as string,
          expirationTime: otpExpireAt,
          name: name as string,
          otp,
        }),
      ]);

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Resend Service');
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
  processLogout: async ({
    accessToken,
    refreshToken,
    userId,
  }: IUserPayload) => {
    try {
      await redisClient.set(
        `blacklist:refreshToken:${userId}`,
        refreshToken!,
        'EX',
        calculateMilliseconds(refreshTokenBlackListExpAt, 'milliseconds')
      );
      await redisClient.set(
        `blacklist:accessToken:${userId}`,
        accessToken!,
        'EX',
        calculateMilliseconds(accessTokenBlackListExpAt, 'second')
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Logout Service');
      }
    }
  },
};

export default UserServices;
