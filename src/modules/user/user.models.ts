import { model, Model, Schema } from 'mongoose';
import IUser from '@/modules/user/user.interfaces';
import { hashPassword } from '@/utils/password.utils';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    avatar: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    phone: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (user.isModified('password') || user.isNew) {
    try {
      user.password = (await hashPassword(user.password)) as string;
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(error);
      } else {
        throw new Error('Unknown error occurred in password hash middleware');
      }
    }
  }
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
