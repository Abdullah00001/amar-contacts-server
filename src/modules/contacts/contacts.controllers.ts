import logger from '@/configs/logger.configs';
import ContactsServices from '@/modules/contacts/contacts.services';
import { Request, Response, NextFunction } from 'express';
import { ICreateContactPayload } from './contacts.interfaces';

const {
  processFindContacts,
  processFindFavorites,
  processFindTrash,
  processCreateContacts,
} = ContactsServices;

const ContactsControllers = {
  handleCreateContact: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const {
        avatar,
        email,
        firstName,
        birthday,
        lastName,
        phone,
        worksAt,
        location,
      } = req.body as ICreateContactPayload;
      const data = await processCreateContacts({
        avatar,
        email,
        firstName,
        birthday,
        lastName,
        phone,
        worksAt,
        location,
        userId,
      });
      res.status(201).json({
        success: true,
        message: 'new contact create successful',
        data,
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
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
