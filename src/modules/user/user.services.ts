import UserRepositories from '@/modules/user/user.repositories';
import IUser, {
  IProcessFindUserReturn,
  IProcessSentRecoverAccountOtpPayload,
  IUserPayload,
} from '@/modules/user/user.interfaces';
import { generate } from 'otp-generator';
import redisClient from '@/configs/redis.configs';
import {
  accessTokenBlackListExpAt,
  otpExpireAt,
  RecoverTokenBlackListExpAt,
  refreshTokenBlackListExpAt,
} from '@/const';
import SendEmail from '@/utils/sendEmail.utils';
import JwtUtils from '@/utils/jwt.utils';
import { Types } from 'mongoose';
import { IRefreshTokenPayload } from '@/interfaces/jwtPayload.interfaces';
import CalculationUtils from '@/utils/calculation.utils';

const { sendAccountVerificationOtpEmail, sendAccountRecoverOtpEmail } =
  SendEmail;

const { createNewUser, verifyUser, findUserByEmail } = UserRepositories;
const { calculateMilliseconds } = CalculationUtils;

const { generateAccessToken, generateRefreshToken, generateRecoverToken } =
  JwtUtils;

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
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
        sendAccountVerificationOtpEmail({
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
      'PX',
      calculateMilliseconds(refreshTokenBlackListExpAt, 'days')
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
        redisClient.set(
          `user:otp:${_id}`,
          otp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
        sendAccountVerificationOtpEmail({
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
        'PX',
        calculateMilliseconds(refreshTokenBlackListExpAt, 'days')
      );
      await redisClient.set(
        `blacklist:accessToken:${userId}`,
        accessToken!,
        'PX',
        calculateMilliseconds(accessTokenBlackListExpAt, 'days')
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Logout Service');
      }
    }
  },
  processFindUser: ({
    _id,
    email,
    isVerified,
    name,
    avatar,
  }: IUser): IProcessFindUserReturn => {
    try {
      const rs_id = generateRecoverToken({
        userId: _id as Types.ObjectId,
        email,
        isVerified,
        name,
        avatar,
      });
      const r_stp1 = generateRecoverToken({
        userId: _id as Types.ObjectId,
        email,
        isVerified,
        name,
        avatar,
      });
      return { rs_id: rs_id as string, r_stp1: r_stp1 as string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find User Service');
      }
    }
  },
  processSentRecoverAccountOtp: async ({
    email,
    name,
    isVerified,
    userId,
    avatar,
    r_stp1,
  }: IProcessSentRecoverAccountOtpPayload) => {
    try {
      const otp = generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
      await Promise.all([
        await redisClient.set(
          `blacklist:recover:r_stp1:${userId}`,
          r_stp1,
          'PX',
          calculateMilliseconds(RecoverTokenBlackListExpAt, 'day')
        ),
        sendAccountRecoverOtpEmail({
          email,
          expirationTime: otpExpireAt,
          name,
          otp,
        }),
        redisClient.set(
          `user:recover:otp:${userId}`,
          otp,
          'PX',
          calculateMilliseconds(otpExpireAt, 'minute')
        ),
      ]);
      const r_stp2 = generateRecoverToken({
        userId,
        email,
        isVerified,
        name,
        avatar,
      });
      return { r_stp2: r_stp2 as string };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find User Service');
      }
    }
  },
};

export default UserServices;
