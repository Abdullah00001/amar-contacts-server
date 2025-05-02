import { Router } from 'express';
import UserControllers from '@/modules/user/user.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';

const { isSignupUserExist, checkOtp, isUserExist } = UserMiddlewares;
const { handleSignUp, handleVerifyUser } = UserControllers;

const router = Router();

router.route('/auth/signup').post(isSignupUserExist, handleSignUp);
router.route('/auth/verify').post(isUserExist, checkOtp, handleVerifyUser);

export default router;
