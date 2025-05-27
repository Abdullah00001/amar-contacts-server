import IContacts, {
  IBirthDate,
  ILocation,
  IWorksAt,
} from '@/modules/contacts/contacts.interfaces';
import { model, Model, Schema } from 'mongoose';

const BirthDaySchema = new Schema<IBirthDate>(
  {
    day: { type: Number, default: null },
    month: { type: String, default: null },
    year: { type: Number, default: null },
  },
  { _id: false }
);

const WorksAtSchema = new Schema<IWorksAt>(
  {
    companyName: { type: String, default: null },
    jobTitle: { type: String, default: null },
  },
  { _id: false }
);

const LocationSchema = new Schema<ILocation>(
  {
    city: { type: String, default: null },
    country: { type: String, default: null },
    streetAddress: { type: String, default: null },
    postCode: { type: Number, default: null },
  },
  { _id: false }
);

const ContactsSchema = new Schema<IContacts>(
  {
    avatar: { type: String, default: null },
    birthday: BirthDaySchema,
    email: { type: String, default: null, index: true },
    firstName: { type: String, default: null, index: true },
    lastName: { type: String, default: null, index: true },
    phone: { type: String, default: null, index: true },
    isTrashed: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false },
    trashedAt: { type: Date, default: null, index: true },
    userId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
      required: true,
    },
    location: LocationSchema,
    worksAt: WorksAtSchema,
  },
  { timestamps: true }
);

const Contacts: Model<IContacts> = model<IContacts>('Contacts', ContactsSchema);

export default Contacts;
