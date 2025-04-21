import { Types } from 'mongoose';

export interface IWorksAt {
  company: string;
  position: string;
}
interface IProfile {
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
  profileId: Types.ObjectId;
}

export default IProfile;
