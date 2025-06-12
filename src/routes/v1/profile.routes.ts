import { Router } from 'express';
import ProfileControllers from '@/modules/profile/profile.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';

const { checkAccessToken } = UserMiddlewares;
const { handleGetProfile, handleUpdateProfile, handleChangePassword } =
  ProfileControllers;

const router = Router();

router
  .route('/me')
  .get(checkAccessToken, handleGetProfile)
  .patch(checkAccessToken, handleUpdateProfile)
  .post(checkAccessToken, handleChangePassword);

export default router;
