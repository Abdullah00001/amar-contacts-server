import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export enum UserRole {
  Host = "host",
  Guest = "guest",
  Admin = "admin",
}
export interface TokenPayload extends JwtPayload {
  userId: mongoose.Schema.Types.ObjectId;
  email: string;
  role: UserRole;
  isVerified: boolean;
}
