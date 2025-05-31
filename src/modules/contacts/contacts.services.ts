import redisClient from '@/configs/redis.configs';
import { IFindContactsPayload } from '@/modules/contacts/contacts.interfaces';
import ContactsRepositories from '@/modules/contacts/contacts.repositories';
import CalculationUtils from '@/utils/calculation.utils';

const { findContacts } = ContactsRepositories;
const { expiresInTimeUnitToMs } = CalculationUtils;

const ContactsServices = {
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
};

export default ContactsServices;
