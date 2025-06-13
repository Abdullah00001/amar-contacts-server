import mailTransporter from '@/configs/nodemailer.configs';
import { env } from '@/env';
import IFeedBack from '@/modules/feedback/feedback.interfaces';
import FeedbackRepositories from '@/modules/feedback/feedback.repositories';

const { createFeedBack } = FeedbackRepositories;
const { SMTP_USER } = env;

const FeedbackServices = {
  processCreateFeedBack: async (payload: IFeedBack) => {
    try {
      await createFeedBack(payload);
      await mailTransporter.sendMail({
        from: SMTP_USER,
        to: SMTP_USER,
        replyTo: payload.userEmail,
        subject: 'New Feed Back',
        text: payload.message,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In createFeedBack Service');
      }
    }
  },
};

export default FeedbackServices;
