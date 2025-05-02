import { Router } from 'express';
import UserControllers from '@/modules/user/user.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';

const { isSignupUserExist } = UserMiddlewares;
const { handleSignUp } = UserControllers;

const router = Router();

router.route('/signup').post(isSignupUserExist, handleSignUp);

export default router;
