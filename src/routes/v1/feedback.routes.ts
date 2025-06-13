import FeedbackControllers from '@/modules/feedback/feedback.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken } = UserMiddlewares;
const { handleCreateFeedBack } = FeedbackControllers;

const router = Router();

router.route('/feedback').post(checkAccessToken, handleCreateFeedBack);

export default router;
