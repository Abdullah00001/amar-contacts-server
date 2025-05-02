import logger from '@/configs/logger.configs';
import UserRepositories from '@/modules/user/user.repositories';
import { NextFunction, Request, Response } from 'express';

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
};

export default UserMiddlewares;
