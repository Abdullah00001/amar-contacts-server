import { IImage } from '@/modules/contacts/contacts.interfaces';
import { Document, Types } from 'mongoose';

export interface IWorksAt {
  company: string;
  position: string;
}
interface IProfile extends Document {
  bio: string;
  worksAt: IWorksAt;
  location: string;
  dateOfBirth: string;
  user: Types.ObjectId;
}

export interface IProfilePayload {
  bio?: string;
  worksAt?: IWorksAt;
  location?: string;
  dateOfBirth?: string;
  user?: Types.ObjectId;
  profileId?: Types.ObjectId;
  name?: string;
  phone?: string;
  avatar?: IImage;
  password?: string;
}

export interface IGetProfileData {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: IImage;
  phone?: string;
}

export default IProfile;
