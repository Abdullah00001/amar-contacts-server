import redisClient from '@/configs/redis.configs';
import { serverCacheExpiredIn } from '@/const';
import { IProfilePayload } from '@/modules/profile/profile.interfaces';
import ProfileRepositories from '@/modules/profile/profile.repositories';
import CalculationUtils from '@/utils/calculation.utils';

const { getProfile, updateProfile } = ProfileRepositories;
const { expiresInTimeUnitToMs } = CalculationUtils;

const ProfileServices = {
  processUpdateProfile: async (payload: IProfilePayload) => {
    try {
      const data = await updateProfile(payload);
      await redisClient.del(`me:${payload.user}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update Profile Service');
      }
    }
  },
  processGetProfile: async (payload: IProfilePayload) => {
    try {
      const cacheData = await redisClient.get(`me:${payload.user}`);
      if (!cacheData) {
        const data = await getProfile(payload);
        await redisClient.set(
          `me:${payload.user}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      } else {
        return JSON.parse(cacheData);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Profile Service');
      }
    }
  },
};

export default ProfileServices;
