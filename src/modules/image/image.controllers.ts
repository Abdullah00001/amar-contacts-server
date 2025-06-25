import { NextFunction, Request, Response } from 'express';
import logger from '@/configs/logger.configs';
import ImageServices from '@/modules/image/image.services';

const { processImageUpload } = ImageServices;

const ImageControllers = {
  handleImageUpload: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const image = req.file?.filename as string;
    try {
      const response = await processImageUpload({ image });
      res.status(200).json({
        status: 'success',
        message: 'Image upload successful',
        data: { image: response },
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleImageDelete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Image delete successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default ImageControllers;
