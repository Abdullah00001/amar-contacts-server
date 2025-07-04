import { join } from 'path';
import CloudinaryConfigs from '@/configs/cloudinary.configs';
import {
  IProcessImageDelete,
  IProcessImageUpload,
} from '@/modules/image/image.interfaces';

const { upload, destroy } = CloudinaryConfigs;

const ImageServices = {
  processImageUpload: async ({ image, publicId }: IProcessImageUpload) => {
    const filePath = join(__dirname, '../../../public/temp', image);
    try {
      const response = await upload(filePath);
      if (publicId) await destroy(publicId);
      return response;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in process upload image');
    }
  },
  processImageDelete: async ({ publicId }: IProcessImageDelete) => {
    try {
      await destroy(publicId);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in process delete image');
    }
  },
};

export default ImageServices;
