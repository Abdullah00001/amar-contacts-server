import ContactsControllers from '@/modules/contacts/contacts.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken } = UserMiddlewares;
const { handleFindContacts, handleFindFavorites, handleFindTrash } =
  ContactsControllers;

const router = Router();

router.route('/contacts').get(checkAccessToken, handleFindContacts);
router.route('/frequents').get(checkAccessToken);
router.route('/favorites').get(checkAccessToken, handleFindFavorites);
router.route('/trash').get(checkAccessToken, handleFindTrash);

export default router;
