import { Types } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  phone:string;
  password: string;
  isVerified: boolean;
  avatar: string;
}

export interface IUserPayload {
  name?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
  avatar?: string;
  userId?: Types.ObjectId;
  phone?:string;
}

export default IUser;
