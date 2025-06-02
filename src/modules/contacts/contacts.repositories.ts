import {
  IChangeFavoriteStatusPayload,
  ICreateContactPayload,
  IFindContactsPayload,
  IFindOneContactPayload,
} from '@/modules/contacts/contacts.interfaces';
import Contacts from '@/modules/contacts/contacts.models';
import mongoose from 'mongoose';

const ContactsRepositories = {
  createContact: async (payload: ICreateContactPayload) => {
    try {
      const newContact = new Contacts(payload);
      await newContact.save();
      return newContact;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Create Contacts Query');
      }
    }
  },
  findOneContact: async ({ contactId }: IFindOneContactPayload) => {
    try {
      return await Contacts.findById(contactId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Contacts Query');
      }
    }
  },
  changeFavoriteStatus: async ({
    contactId,
    isFavorite,
  }: IChangeFavoriteStatusPayload) => {
    try {
      return await Contacts.findByIdAndUpdate(
        contactId,
        { $set: { isFavorite } },
        { new: true }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          'Unknown Error Occurred In Change Contacts Favorite Status Query'
        );
      }
    }
  },
  findContacts: async ({ userId }: IFindContactsPayload) => {
    try {
      const objectUserId = new mongoose.Types.ObjectId(userId);
      return await Contacts.aggregate([
        { $match: { userId: objectUserId, isTrashed: false } },
        {
          $project: {
            _id: 1,
            avatar: 1,
            name: {
              $concat: [
                { $ifNull: ['$firstName', ''] },
                ' ',
                { $ifNull: ['$lastName', ''] },
              ],
            },
            isTrashed: 1,
            isFavorite: 1,
            email: 1,
            phone: 1,
          },
        },
      ]);
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
