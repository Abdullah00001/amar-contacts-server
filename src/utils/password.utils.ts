import bcrypt from 'bcrypt';
import { saltRound } from '@/const';
import logger from '@/configs/logger.configs';

const PasswordUtils = {
  hashPassword: async (passwordString: string): Promise<string | null> => {
    try {
      return await bcrypt.hash(passwordString, saltRound);
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`Error Occurred In Hash Password Utils: ${error.message}`);
        return null;
      } else {
        logger.warn('Unexpected Error Occurred In Hash Password Utils');
        return null;
      }
    }
  },
  comparePassword: async (
    requestedPassword: string,
    hashPassword: string
  ): Promise<boolean | null> => {
    try {
      return await bcrypt.compare(requestedPassword, hashPassword);
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(
          `Error Occurred In Compare Password Utils: ${error.message}`
        );
        return null;
      } else {
        logger.warn('Unexpected Error Occurred In Compare Password Utils');
        return null;
      }
    }
  },
};

export default PasswordUtils;
