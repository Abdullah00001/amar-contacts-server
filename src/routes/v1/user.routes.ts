import { Router } from 'express';
import UserControllers from '@/modules/user/user.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';

const {
  isSignupUserExist,
  checkOtp,
  isUserExistAndVerified,
  checkPassword,
  isUserExist,
  checkAccessToken,
} = UserMiddlewares;
const { handleSignUp, handleVerifyUser, handleLogin, handleCheck } =
  UserControllers;

const router = Router();

router.route('/auth/signup').post(isSignupUserExist, handleSignUp);
router.route('/auth/verify').post(isUserExist, checkOtp, handleVerifyUser);
router
  .route('/auth/login')
  .post(isUserExistAndVerified, checkPassword, handleLogin);
router.route('/auth/check').post(checkAccessToken, handleCheck);

export default router;
