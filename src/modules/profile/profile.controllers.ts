import logger from '@/configs/logger.configs';
import { IProfilePayload } from '@/modules/profile/profile.interfaces';
import ProfileServices from '@/modules/profile/profile.services';
import { NextFunction, Request, Response } from 'express';

const { processGetProfile, processUpdateProfile } = ProfileServices;

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
};

export default ProfileControllers;
