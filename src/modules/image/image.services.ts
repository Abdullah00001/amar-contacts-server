import { promises as fs } from 'fs';
import { join } from 'path';
import CloudinaryConfigs from '@/configs/cloudinary.configs';
import { IProcessImageUpload } from '@/modules/image/image.interfaces';

const { upload } = CloudinaryConfigs;

const ImageServices = {
  processImageUpload: async ({ image }: IProcessImageUpload) => {
    const filePath = join(__dirname, '../../../public/temp', image);
    try {
      const response = await upload(filePath);
      return response;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown error occurred in process upload image');
    }
  },
  processImageDelete:async()=>{
    
  }
};

export default ImageServices;
