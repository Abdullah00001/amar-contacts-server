import IProfile, {
  IProfilePayload,
} from '@/modules/profile/profile.interfaces';
import Profile from '@/modules/profile/profile.models';
import IUser from '@/modules/user/user.interfaces';
import User from '@/modules/user/user.models';
import mongoose from 'mongoose';

const ProfileRepositories = {
  updateProfile: async ({
    bio,
    dateOfBirth,
    location,
    user,
    worksAt,
    name,
    phone,
    avatar,
  }: IProfilePayload) => {
    try {
      if (bio || dateOfBirth || location || worksAt) {
        const updatePayload: Partial<IProfile> = {};
        if (bio !== undefined) updatePayload.bio = bio;
        if (dateOfBirth !== undefined) updatePayload.dateOfBirth = dateOfBirth;
        if (location !== undefined) updatePayload.location = location;
        if (worksAt !== undefined) updatePayload.worksAt = worksAt;
        const projection: Record<string, 0 | 1> = { _id: 0 };
        for (const key of Object.keys(updatePayload)) {
          projection[key] = 1;
        }
        const result = await Profile.findOneAndUpdate(
          { user },
          {
            $set: updatePayload,
          },
          { new: true, projection }
        );
        const data = result?.toObject?.();
        delete data?._id;
        return data;
      } else {
        const updatePayload: Partial<IUser> = {};
        if (name !== undefined) updatePayload.name = name;
        if (phone !== undefined) updatePayload.phone = phone;
        if (avatar !== undefined) updatePayload.avatar = avatar;
        const projection: Record<string, 0 | 1> = { _id: 0 };
        for (const key of Object.keys(updatePayload)) {
          projection[key] = 1;
        }
        const result = await User.findOneAndUpdate(
          { _id: user },
          {
            $set: updatePayload,
          },
          { new: true, projection }
        );
        const data = result?.toObject?.();
        delete data?._id;
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Update Profile Query');
      }
    }
  },
  getProfile: async ({ user }: IProfilePayload): Promise<IProfilePayload> => {
    const objectUserId = new mongoose.Types.ObjectId(user);
    try {
      const profileData = await Profile.aggregate([
        { $match: { user: objectUserId } },
        {
          $project: {
            bio: 1,
            worksAt: 1,
            location: 1,
            dateOfBirth: 1,
          },
        },
      ]);
      const userData = await User.aggregate([
        {
          $match: {
            _id: objectUserId,
          },
        },
        {
          $project: {
            name: 1,
            phone: 1,
            avatar: 1,
          },
        },
      ]);
      return { ...profileData[0], ...userData[0] };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Profile Query');
      }
    }
  },
};

export default ProfileRepositories;
