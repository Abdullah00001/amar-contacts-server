import FeedbackServices from '@/modules/feedback/feedback.services';
import { NextFunction, Request, Response } from 'express';
import logger from '@/configs/logger.configs';

const { processCreateFeedBack } = FeedbackServices;

const FeedbackControllers = {
  handleCreateFeedBack: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.decoded;
    const { message } = req.body;
    try {
      await processCreateFeedBack({ userEmail: email, message });
      res
        .status(201)
        .json({ status: 'success', message: 'Feedback Submitted' });
      return;
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
};

export default FeedbackControllers;
