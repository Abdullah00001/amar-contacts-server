import { IVerificationEmailData } from '@/interfaces/verificationEmailData.interfaces';
import { EmailQueue } from '@/queue/queues';

const EmailQueueJobs = {
  addSendAccountVerificationOtpEmailToQueue: async (
    data: IVerificationEmailData
  ) => {
    await EmailQueue.add('send-account-verification-otp-email', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: { type: 'exponential', delay: 3000 },
    });
  },
};

export default EmailQueueJobs;
