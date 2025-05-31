import { IFindContactsPayload } from '@/modules/contacts/contacts.interfaces';
import Contacts from '@/modules/contacts/contacts.models';

const ContactsRepositories = {
  findContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      return await Contacts.find({ userId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Contacts Query');
      }
    }
  },
};

export default ContactsRepositories;
