import redisClient from '@/configs/redis.configs';
import {
  IChangeFavoriteStatusPayload,
  ICreateContactPayload,
  IFindContactsPayload,
} from '@/modules/contacts/contacts.interfaces';
import ContactsRepositories from '@/modules/contacts/contacts.repositories';
import CalculationUtils from '@/utils/calculation.utils';

const {
  findContacts,
  findFavorites,
  findTrash,
  createContact,
  changeFavoriteStatus,
} = ContactsRepositories;
const { expiresInTimeUnitToMs } = CalculationUtils;

const ContactsServices = {
  processCreateContacts: async ({
    avatar,
    email,
    firstName,
    birthday,
    lastName,
    phone,
    worksAt,
    location,
    userId,
  }: ICreateContactPayload) => {
    try {
      const data = await createContact({
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
      await redisClient.del(`contacts:${userId}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Create Contacts');
      }
    }
  },
  processChangeFavoriteStatus: async ({
    contactId,
    isFavorite,
    userId,
  }: IChangeFavoriteStatusPayload) => {
    try {
      const data = await changeFavoriteStatus({ contactId, isFavorite });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`contacts:${userId}:${contactId}`),
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Change Contacts Favorite Status'
        );
      }
    }
  },
  processFindContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      const cachedContacts = await redisClient.get(`contacts:${userId}`);
      if (!cachedContacts) {
        const data = await findContacts({ userId });
        await redisClient.set(
          `contacts:${userId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs('5m')
        );
        return data;
      }
      return JSON.parse(cachedContacts);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find Contacts');
      }
    }
  },
  processFindFavorites: async ({ userId }: IFindContactsPayload) => {
    try {
      const cachedFavorites = await redisClient.get(`favorites:${userId}`);
      if (!cachedFavorites) {
        const data = await findFavorites({ userId });
        await redisClient.set(
          `favorites:${userId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs('5m')
        );
        return data;
      }
      return JSON.parse(cachedFavorites);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find Favorites');
      }
    }
  },
  processFindTrash: async ({ userId }: IFindContactsPayload) => {
    try {
      const cachedTrash = await redisClient.get(`trash:${userId}`);
      if (!cachedTrash) {
        const data = await findTrash({ userId });
        await redisClient.set(
          `trash:${userId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs('5m')
        );
        return data;
      }
      return JSON.parse(cachedTrash);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find Trash');
      }
    }
  },
};

export default ContactsServices;
