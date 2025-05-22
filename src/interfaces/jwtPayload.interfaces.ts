import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface TokenPayload extends JwtPayload {
  userId: Types.ObjectId;
  email: string;
  isVerified: boolean;
  name: string;
}

export interface IRefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}
