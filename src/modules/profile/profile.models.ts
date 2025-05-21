import { model, Model, Schema } from 'mongoose';
import IProfile from './profile.interfaces';

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'User',
      required: true,
    },
    bio: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    location: { type: String, default: null },
    worksAt: {
      company: { type: String, default: null },
      position: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const Profile: Model<IProfile> = model<IProfile>('Profile', ProfileSchema);

export default Profile;
