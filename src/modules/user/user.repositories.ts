import Profile from '@/modules/profile/profile.models';
import { IUserPayload } from '@/modules/user/user.interfaces';
import User from '@/modules/user/user.models';
import { startSession } from 'mongoose';

const UserRepositories = {
  findUserByEmail: async (payload: string) => {
    try {
      const foundedUser = await User.findOne({ email: payload });
      return foundedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Find Operation');
      }
    }
  },
  createNewUser: async (payload: IUserPayload) => {
    const session = await startSession();
    session.startTransaction();
    try {
      const newUser = new User(payload);
      const newProfile = new Profile({ user: newUser._id });
      await newProfile.save({ session });
      await newUser.save({ session });
      await session.commitTransaction();
      session.endSession();
      return newUser;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Creation Operation');
      }
    }
  },
  verifyUser: async ({ email }: IUserPayload) => {
    try {
      const verifiedUser = await User.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } },
        { new: true }
      );
      return verifiedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In User Verify Operation');
      }
    }
  },
};

export default UserRepositories;
