import { Month } from '@/modules/contacts/contacts.enums';
import { Types } from 'mongoose';

export interface IWorksAt {
  companyName: string;
  jobTitle: string;
}

export interface ILocation {
  country: string;
  city: string;
  postCode: number;
  streetAddress: string;
}

export interface IBirthDate {
  day: number;
  month: Month;
  year: number;
}

interface IContacts {
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  worksAt: IWorksAt;
  location: ILocation;
  birthday: IBirthDate;
  isFavorite: boolean;
  isTrashed: boolean;
  trashedAt: Date;
  userId: Types.ObjectId;
}

export default IContacts;
