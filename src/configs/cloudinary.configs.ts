import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { env } from '@/env';
import fs from 'fs';

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY, CLOUDINARY_NAME } = env;

const CloudinaryConfigs = {
  initializedCloudinary: (): void => {
    const configuration: ConfigOptions = {
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET_KEY,
    };
    cloudinary.config(configuration);
  },
  upload: async (imagePath: string) => {
    try {
      if (!imagePath) {
        return null;
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(imagePath, {
        resource_type: 'auto',
      });
      fs.unlinkSync(imagePath);
      return {
        url: cloudinaryResponse.url,
        publicId: cloudinaryResponse.public_id,
      };
    } catch (error) {
      fs.unlinkSync(imagePath);
      if (error instanceof Error) {
        console.error(`Image Upload Failed\nMessage: ${error.message}`);
      } else {
        console.error(
          'An unexpected error occurred during the image upload process.'
        );
      }
      fs.unlinkSync(imagePath);
      return null;
    }
  },
};

export default CloudinaryConfigs;
