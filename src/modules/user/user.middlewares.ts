import logger from '@/configs/logger.configs';
import redisClient from '@/configs/redis.configs';
import UserRepositories from '@/modules/user/user.repositories';
import { NextFunction, Request, Response } from 'express';
import IUser from './user.interfaces';

const { findUserByEmail } = UserRepositories;

const UserMiddlewares = {
  isSignupUserExist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const isUser = await findUserByEmail(email);
      if (isUser) {
        res.status(409).json({ success: false, message: 'User already exist' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In isSignupUser Exist Middleware');
        next(error);
      }
    }
  },
  isUserExist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const isUser = await findUserByEmail(email);
      if (!isUser) {
        res
          .status(404)
          .json({ success: false, message: 'User with this email not found' });
        return;
      }
      req.user = isUser;
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In isUser Exist Middleware');
        next(error);
      }
    }
  },
  checkOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body;
      const user = req?.user as IUser;
      const storedOtp = await redisClient.get(`user:otp:${user?._id}`);
      if (!storedOtp) {
        res
          .status(400)
          .json({ success: false, message: 'Otp has been expired' });
        return;
      }
      if (storedOtp !== otp) {
        res.status(400).json({ success: false, message: 'Invalid otp' });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error('Unknown Error Occurred In Check Otp Middleware');
        next(error);
      }
    }
  },
};

export default UserMiddlewares;
