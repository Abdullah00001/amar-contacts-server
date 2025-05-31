import ContactsControllers from '@/modules/contacts/contacts.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken } = UserMiddlewares;
const { handleFindContacts } = ContactsControllers;

const router = Router();

router.route('/contacts').get(checkAccessToken, handleFindContacts);
router.route('/frequents').get(checkAccessToken);
router.route('/favorites').get(checkAccessToken);
router.route('/trash').get(checkAccessToken);

export default router;
