import logger from '@/configs/logger.configs';
import ContactsServices from '@/modules/contacts/contacts.services';
import { Request, Response, NextFunction } from 'express';
import IContacts, {
  ICreateContactPayload,
} from '@/modules/contacts/contacts.interfaces';
import mongoose from 'mongoose';
import CalculationUtils from '@/utils/calculation.utils';

const { generateEtag } = CalculationUtils;

const {
  processFindContacts,
  processFindFavorites,
  processFindTrash,
  processCreateContacts,
  processChangeFavoriteStatus,
  processFindOneContact,
  processPatchUpdateOneContact,
  processPutUpdateOneContact,
  processChangeTrashStatus,
  processBulkChangeTrashStatus,
  processDeleteManyContact,
  processDeleteSingleContact,
  processSearchContact,
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
  handleChangeFavoriteStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
        return;
      }
      const contactId = new mongoose.Types.ObjectId(id);
      const { isFavorite } = req.body;
      const data = await processChangeFavoriteStatus({
        contactId,
        isFavorite,
        userId,
      });
      res.status(200).json({
        success: true,
        message: 'marked contact as favorite',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleChangeTrashStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
        return;
      }
      const contactId = new mongoose.Types.ObjectId(id);
      const { isTrashed } = req.body;
      const data = await processChangeTrashStatus({
        contactId,
        isTrashed,
        userId,
      });
      res.status(200).json({
        success: true,
        message: 'marked contact as trash',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleBulkChangeTrashStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const { contactIds } = req.body;
      await processBulkChangeTrashStatus({ contactIds, userId });
      res.status(200).json({
        success: true,
        message: 'marked contacts as trash',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleFindOneContacts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.decoded;
    const { id } = req.params;
    const oldEtag = req.headers['if-none-match'];
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid contactID' });
        return;
      }
      const contactId = new mongoose.Types.ObjectId(id);
      const data = (await processFindOneContact({
        contactId,
        userId,
      })) as IContacts;
      if (!data)
        res.status(404).json({
          success: false,
          message: 'contact not found',
        });
      const eTag = generateEtag(data);
      if (oldEtag !== eTag) {
        res.setHeader('Cache-Control', 'private max-age:30');
        res.setHeader('ETag', eTag);
        res
          .status(200)
          .json({ status: 'success', message: 'contact retrieved', data });
        return;
      }
      res.status(304).end();
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleDeleteOneContact: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
        return;
      }
      const contactId = new mongoose.Types.ObjectId(id);
      const isDeleted = await processDeleteSingleContact({ contactId, userId });
      if (!isDeleted) {
        res
          .status(400)
          .json({ status: 'error', message: 'delete contact failed' });
        return;
      }
      res.status(200).json({ status: 'success', message: 'contact deleted' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleDeleteManyContact: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const { contactIds } = req.body;
      const isDeleted = await processDeleteManyContact({ contactIds, userId });
      if (!isDeleted) {
        res
          .status(400)
          .json({ status: 'error', message: 'delete contacts failed' });
        return;
      }
      res.status(200).json({ status: 'success', message: 'contacts deleted' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handlePatchUpdateOneContact: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.decoded;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: 'error', message: 'Invalid Contact ID' });
        return;
      }
      const contactId = new mongoose.Types.ObjectId(id);
      const {
        avatar,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
      } = req.body;
      const data = await processPatchUpdateOneContact({
        contactId,
        avatar,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
        userId,
      });
      res.status(200).json({
        success: true,
        message: 'contact updated successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handlePutUpdateOneContact: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const avatarImage = req.file?.filename as string;
    try {
      const { userId } = req.decoded;
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: 'error', message: 'Invalid Contact ID' });
        return;
      }
      const contactId = new mongoose.Types.ObjectId(id);
      const {
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
        avatar,
      } = req.body;
      const data = await processPutUpdateOneContact({
        avatarUpload: avatarImage,
        avatar:JSON.parse(avatar),
        contactId,
        birthday:JSON.parse(birthday),
        email,
        firstName,
        lastName,
        location:JSON.parse(location),
        phone,
        worksAt:JSON.parse(worksAt),
        userId,
      });
      res.status(200).json({
        success: true,
        message: 'contact updated successful',
        data,
      });
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
  handleSearchContact: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { query } = req.query;
    const { userId } = req.decoded;
    try {
      const data = await processSearchContact({
        query: query as string,
        userId,
      });
      res.status(200).json({
        success: true,
        message: 'Search Contacts Found',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default ContactsControllers;
