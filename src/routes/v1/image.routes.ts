import { Router } from 'express';
import UserMiddlewares from '@/modules/user/user.middlewares';
import upload from '@/middlewares/multer.middleware';
import ImageControllers from '@/modules/image/image.controllers';

const { checkAccessToken } = UserMiddlewares;
const { handleImageUpload, handleImageDelete } = ImageControllers;

const router = Router();

router
  .route('/image')
  .post(checkAccessToken, upload.single('image'), handleImageUpload);
router.route('/image/:public_id').delete(checkAccessToken, handleImageDelete);

export default router;
