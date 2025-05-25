import { Router } from 'express';
import UserControllers from '@/modules/user/user.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';

const {
  isSignupUserExist,
  checkOtp,
  isUserExistAndVerified,
  checkPassword,
  isUserExist,
  isUserVerified,
  checkAccessToken,
  checkRefreshToken,
  checkRecoverToken,
  checkRecoverOtp,
} = UserMiddlewares;
const {
  handleSignUp,
  handleVerifyUser,
  handleLogin,
  handleCheck,
  handleRefreshTokens,
  handleLogout,
  handleResend,
  handleFindUser,
  handleSentRecoverOtp,
  handleVerifyRecoverOtp,
  handleResendRecoverOtp,
  handleResetPassword,
} = UserControllers;

const router = Router();

router.route('/auth/signup').post(isSignupUserExist, handleSignUp);
router.route('/auth/verify').post(isUserExist, checkOtp, handleVerifyUser);
router.route('/auth/resend').post(isUserExist, handleResend);
router
  .route('/auth/login')
  .post(isUserExistAndVerified, checkPassword, handleLogin);
router.route('/auth/check').post(checkAccessToken, handleCheck);
router.route('/auth/refresh').post(checkRefreshToken, handleRefreshTokens);
router.route('/auth/logout').post(checkRefreshToken, handleLogout);
router
  .route('/auth/recover/find')
  .post(isUserExist, isUserVerified, handleFindUser);
router
  .route('/auth/recover/sent-otp')
  .post(checkRecoverToken, handleSentRecoverOtp);
router
  .route('/auth/recover/verify')
  .post(checkRecoverToken, checkRecoverOtp, handleVerifyRecoverOtp);

router
  .route('/auth/recover/resent')
  .post(checkRecoverToken, handleResendRecoverOtp);

router
  .route('/auth/recover/reset')
  .patch(checkRecoverToken, handleResetPassword);

export default router;
