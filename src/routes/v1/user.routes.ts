import { Router } from 'express';
import UserControllers from '@/modules/user/user.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';

const {
  isSignupUserExist,
  checkOtp,
  isUserExistAndVerified,
  checkPassword,
  isUserExist,
} = UserMiddlewares;
const { handleSignUp, handleVerifyUser, handleLogin } = UserControllers;

const router = Router();

router.route('/auth/signup').post(isSignupUserExist, handleSignUp);
router.route('/auth/verify').post(isUserExist, checkOtp, handleVerifyUser);
router
  .route('/auth/login')
  .post(isUserExistAndVerified, checkPassword, handleLogin);

export default router;
