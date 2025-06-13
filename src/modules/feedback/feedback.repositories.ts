import IFeedBack from '@/modules/feedback/feedback.interfaces';
import Feedback from '@/modules/feedback/feedback.models';

const FeedbackRepositories = {
  createFeedBack: async (payload: IFeedBack) => {
    try {
      const newFeedBack = new Feedback(payload);
      await newFeedBack.save();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In createFeedBack Query');
      }
    }
  },
};

export default FeedbackRepositories;
