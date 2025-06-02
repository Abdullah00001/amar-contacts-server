import redisClient from '@/configs/redis.configs';
import { serverCacheExpiredIn } from '@/const';
import {
  IBulkChangeTrashStatusPayload,
  IChangeFavoriteStatusPayload,
  IChangeTrashStatusPayload,
  ICreateContactPayload,
  IDeleteManyContactPayload,
  IDeleteSingleContactPayload,
  IFindContactsPayload,
  IFindOneContactPayload,
  IUpdateOneContactPayload,
} from '@/modules/contacts/contacts.interfaces';
import ContactsRepositories from '@/modules/contacts/contacts.repositories';
import CalculationUtils from '@/utils/calculation.utils';

const {
  findContacts,
  findFavorites,
  findTrash,
  createContact,
  changeFavoriteStatus,
  findOneContact,
  updateOneContact,
  changeTrashStatus,
  bulkChangeTrashStatus,
  deleteManyContact,
  deleteSingleContact,
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
  processFindOneContact: async ({
    contactId,
    userId,
  }: IFindOneContactPayload) => {
    try {
      const data = await redisClient.get(`contacts:${userId}:${contactId}`);
      if (!data) {
        const data = await findOneContact({ contactId });
        await redisClient.set(
          `contacts:${userId}:${contactId}`,
          JSON.stringify(data),
          'PX',
          expiresInTimeUnitToMs(serverCacheExpiredIn)
        );
        return data;
      }
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Process Find One Contacts');
      }
    }
  },
  processUpdateOneContact: async ({
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
  }: IUpdateOneContactPayload) => {
    try {
      const data = await updateOneContact({
        contactId,
        avatar,
        birthday,
        email,
        firstName,
        lastName,
        location,
        phone,
        worksAt,
      });
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
          'Unknown Error Occurred In Process Update One Contacts'
        );
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
        redisClient.del(`favorites:${userId}`),
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
  processChangeTrashStatus: async ({
    contactId,
    isTrashed,
    userId,
  }: IChangeTrashStatusPayload) => {
    try {
      const data = await changeTrashStatus({ contactId, isTrashed });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        redisClient.del(`contacts:${userId}:${contactId}`),
        redisClient.del(`trash:${userId}`),
        redisClient.del(`favorites:${userId}`),
      ]);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Change Contacts Trash Status'
        );
      }
    }
  },
  processBulkChangeTrashStatus: async ({
    contactIds,
    userId,
  }: IBulkChangeTrashStatusPayload) => {
    try {
      await bulkChangeTrashStatus({ contactIds });
      await Promise.all([
        redisClient.del(`contacts:${userId}`),
        ...contactIds!?.map((contactId) =>
          redisClient.del(`contacts:${userId}:${contactId}`)
        ),
        redisClient.del(`trash:${userId}`),
        redisClient.del(`favorites:${userId}`),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Bulk Change Contacts Trash Status'
        );
      }
    }
  },
  processDeleteSingleContact: async ({
    contactId,
    userId,
  }: IDeleteSingleContactPayload) => {
    try {
      const isDeleted = await deleteSingleContact({ contactId });
      if (!isDeleted) return null;
      await redisClient.del(`trash:${userId}`);
      return isDeleted;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Delete Single Contacts'
        );
      }
    }
  },
  processDeleteManyContact: async ({
    contactIds,
    userId,
  }: IDeleteManyContactPayload) => {
    try {
      const isDeleted = await deleteManyContact({ contactIds });
      if (!isDeleted.deletedCount) return null;
      await redisClient.del(`trash:${userId}`);
      return isDeleted;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Process Delete Single Contacts'
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
          expiresInTimeUnitToMs(serverCacheExpiredIn)
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
          expiresInTimeUnitToMs(serverCacheExpiredIn)
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
          expiresInTimeUnitToMs(serverCacheExpiredIn)
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
