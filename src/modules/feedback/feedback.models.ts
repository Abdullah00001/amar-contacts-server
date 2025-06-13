import IFeedBack from '@/modules/feedback/feedback.interfaces';
import { model, Model, Schema } from 'mongoose';

const FeedBackSchema = new Schema<IFeedBack>(
  {
    userEmail: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedBack> = model<IFeedBack>('Feedback', FeedBackSchema);

export default Feedback;
