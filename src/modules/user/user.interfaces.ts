import { Document, Types } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
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
  phone?: string;
  otp?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IProcessFindUserReturn {
  rs_id: string;
  r_stp1: string;
}

export interface IProcessSentRecoverAccountOtpPayload {
  userId: Types.ObjectId;
  email: string;
  isVerified: boolean;
  name: string;
  avatar?: string;
  r_stp1: string;
}

export default IUser;
