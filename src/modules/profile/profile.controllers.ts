import logger from '@/configs/logger.configs';
import { IProfilePayload } from '@/modules/profile/profile.interfaces';
import ProfileServices from '@/modules/profile/profile.services';
import { NextFunction, Request, Response } from 'express';

const {
  processGetProfile,
  processUpdateProfile,
  processChangePassword,
  processDeleteAccount,
} = ProfileServices;

const ProfileControllers = {
  handleUpdateProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const payload: IProfilePayload = req.body;
      const data = await processUpdateProfile({ ...payload, user: userId });
      res.status(200).json({
        status: 'success',
        message: 'update profile successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleGetProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decoded;
      const data = await processGetProfile({ user: userId });
      res
        .status(200)
        .json({ status: 'success', message: 'get profile successful', data });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleChangePassword: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { userId } = req.decoded;
      await processChangePassword({ password, user: userId });
      res
        .status(200)
        .json({ status: 'success', message: 'password change successful' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleDeleteAccount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.decoded;
    try {
      await processDeleteAccount({ user: userId });
      res
        .status(200)
        .json({ status: 'success', message: 'account delete successful' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default ProfileControllers;
