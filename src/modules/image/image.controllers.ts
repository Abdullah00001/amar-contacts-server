import { NextFunction, Request, Response } from 'express';
import logger from '@/configs/logger.configs';
import ImageServices from '@/modules/image/image.services';

const { processImageUpload, processImageDelete } = ImageServices;

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
      return;
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
    const { folder, public_id } = req.params;
    if (!public_id && !folder) {
      res.status(400).json({
        status: 'error',
        message: 'public_id is required to delete an image',
      });
      return;
    }
    const publicId = `${folder}/${public_id}`;
    try {
      await processImageDelete({ publicId });
      res.status(200).json({
        status: 'success',
        message: 'Image delete successful',
      });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default ImageControllers;
