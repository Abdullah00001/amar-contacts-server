import { Request, Response, NextFunction } from 'express';
import logger from '@/configs/logger.configs';
import UserServices from '@/modules/user/user.services';
import IUser from '@/modules/user/user.interfaces';
import cookieOption from '@/utils/cookie.utils';
import { env } from 'process';

const {
  processSignup,
  processVerifyUser,
  processLogin,
  processTokens,
  processLogout,
  processResend,
  processFindUser,
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
      res.cookie('accesstoken', accessToken, cookieOption(30, null));
      res.cookie('refreshtoken', refreshToken, cookieOption(null, 7));
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
      res.cookie('accesstoken', accessToken, cookieOption(30, null));
      res.cookie('refreshtoken', refreshToken, cookieOption(null, 7));
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
      res.clearCookie('accesstoken');
      res.clearCookie('refreshtoken');
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
      res.clearCookie('refreshtoken');
      res.cookie('accesstoken', accessToken, cookieOption(30, null));
      res.cookie('refreshtoken', refreshToken, cookieOption(null, 7));
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
      const { r_stp1, rs_id } = processFindUser(user);
      res.cookie('rs_id', rs_id, cookieOption(null, 1));
      res.cookie('r_stp1', r_stp1, {
        httpOnly: false,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        status: 'success',
        message: 'User Found',
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
