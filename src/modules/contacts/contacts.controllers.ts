import logger from '@/configs/logger.configs';
import ContactsServices from '@/modules/contacts/contacts.services';
import { Request, Response, NextFunction } from 'express';

const { processFindContacts, processFindFavorites, processFindTrash } =
  ContactsServices;

const ContactsControllers = {
  handleFindContacts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const data = await processFindContacts({ userId });
      res.setHeader('Cache-Control', 'private max-age:30');
      res.status(200).json({
        success: true,
        message: 'all contacts retrieved successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleFindFavorites: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const data = await processFindFavorites({ userId });
      res.setHeader('Cache-Control', 'private max-age:30');
      res.status(200).json({
        success: true,
        message: 'all Favorites retrieved successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleFindTrash: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.decoded;
      const data = await processFindTrash({ userId });
      res.setHeader('Cache-Control', 'private max-age:30');
      res.status(200).json({
        success: true,
        message: 'all Trash retrieved successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default ContactsControllers;
