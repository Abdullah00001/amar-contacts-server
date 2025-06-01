import { IFindContactsPayload } from '@/modules/contacts/contacts.interfaces';
import Contacts from '@/modules/contacts/contacts.models';

const ContactsRepositories = {
  findContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      return await Contacts.find({ userId, isTrashed: false });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Contacts Query');
      }
    }
  },
  findFavorites: async ({ userId }: IFindContactsPayload) => {
    try {
      return await Contacts.find({
        userId,
        isTrashed: false,
        isFavorite: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Find Favorites Query');
      }
    }
  },
  findTrash: async ({ userId }: IFindContactsPayload) => {
    try {
      return await Contacts.find({
        userId,
        isTrashed: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find Find Trash Query');
      }
    }
  },
};

export default ContactsRepositories;
