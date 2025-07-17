import { Request, Response, NextFunction } from 'express';
import logger from '@/configs/logger.configs';
import UserServices from '@/modules/user/user.services';
import IUser from '@/modules/user/user.interfaces';
import CookieUtils from '@/utils/cookie.utils';
import UserMiddlewares from '@/modules/user/user.middlewares';
import {
  accessTokenExpiresIn,
  getLocationFromIP,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
} from '@/const';

const { cookieOption } = CookieUtils;
const { getRealIP } = UserMiddlewares;

const {
  processSignup,
  processVerifyUser,
  processLogin,
  processTokens,
  processLogout,
  processResend,
  processFindUser,
  processSentRecoverAccountOtp,
  processVerifyOtp,
  processReSentRecoverAccountOtp,
  processResetPassword,
} = UserServices;

const UserControllers = {
  handleSignUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const createdUser = await processSignup({ name, email, password });
      res.status(201).json({
        success: true,
        message: 'User signup successful',
        data: createdUser,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleCheck: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleVerifyUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req?.user as IUser;
      const { accessToken, refreshToken } = await processVerifyUser(user);
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        success: true,
        message: 'Email verification successful',
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleResend: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req?.user as IUser;
      await processResend(user);
      res.status(200).json({
        success: true,
        message: 'Verification Email Resend Successful',
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  handleLogin: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = processLogin(req.user as IUser);
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleLogout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decoded;
      const { accesstoken, refreshtoken } = req.cookies;
      await processLogout({
        accessToken: accesstoken,
        refreshToken: refreshtoken,
        userId,
      });
      res.clearCookie('accesstoken', cookieOption(accessTokenExpiresIn));
      res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'Logout successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleRefreshTokens: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentRefreshToken = req.cookies?.refreshtoken;
      const { email, isVerified, name, userId } = req.decoded;
      const { accessToken, refreshToken } = await processTokens({
        userId,
        email,
        isVerified,
        name,
        refreshToken: currentRefreshToken,
      });
      res.clearCookie('refreshtoken', cookieOption(refreshTokenExpiresIn));
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Token refreshed',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleFindUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser;
      const { r_stp1 } = processFindUser(user);
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp1', r_stp1, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'User Found',
        stepToken: r_stp1,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp1: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.decoded;
      res.status(200).json({
        status: 'success',
        data: { email, name, avatar },
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp2: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleCheckR_Stp3: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(204).send();
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleSentRecoverOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, isVerified, name, userId, avatar } = req.decoded;
      const r_stp1 = req.cookies?.r_stp1;
      const { r_stp2 } = await processSentRecoverAccountOtp({
        email,
        isVerified,
        name,
        userId,
        avatar,
        r_stp1,
      });
      res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp2', r_stp2, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'Recover Otp Send Successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleVerifyRecoverOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, isVerified, name, userId, avatar } = req.decoded;
      const r_stp2 = req.cookies?.r_stp2;
      const { r_stp3 } = await processVerifyOtp({
        email,
        isVerified,
        name,
        userId,
        avatar,
        r_stp2,
      });
      res.clearCookie('r_stp1', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp2', cookieOption(recoverSessionExpiresIn));
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie('r_stp3', r_stp3, cookieOption(recoverSessionExpiresIn));
      res.status(200).json({
        status: 'success',
        message: 'OTP verification successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleResendRecoverOtp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, name, userId } = req.decoded;
      await processReSentRecoverAccountOtp({ email, name, userId });
      res.status(200).json({
        status: 'success',
        message: 'OTP resent successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleResetPassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { email, name, userId, isVerified } = req.decoded;
      const r_stp3 = req.cookies?.r_stp3;
      const ipAddress = getRealIP(req);
      let locationInfo = null;
      let location = 'Unknown';
      if (
        ipAddress &&
        ipAddress !== '::1' &&
        ipAddress !== '127.0.0.1' &&
        ipAddress.length > 5
      ) {
        try {
          locationInfo = await getLocationFromIP(ipAddress);
          if (
            locationInfo?.city &&
            locationInfo?.regionName &&
            locationInfo?.country
          ) {
            location = `${locationInfo.city}, ${locationInfo.regionName}, ${locationInfo.country}`;
          }
        } catch (locationError) {
          console.error('Location lookup failed:', locationError);
        }
      }
      const device = `${req?.useragent?.browser} ${req?.useragent?.version} on ${req?.useragent?.os}`;
      const { accessToken, refreshToken } = await processResetPassword({
        email,
        name,
        userId,
        isVerified,
        r_stp3,
        device,
        ipAddress: ipAddress[0],
        location: location,
        password,
      });
      res.clearCookie('r_stp3', cookieOption(recoverSessionExpiresIn));
      res.cookie(
        'accesstoken',
        accessToken,
        cookieOption(accessTokenExpiresIn)
      );
      res.cookie(
        'refreshtoken',
        refreshToken,
        cookieOption(refreshTokenExpiresIn)
      );
      res.status(200).json({
        status: 'success',
        message: 'Password Reset Successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default UserControllers;
