import ContactsControllers from '@/modules/contacts/contacts.controllers';
import UserMiddlewares from '@/modules/user/user.middlewares';
import { Router } from 'express';

const { checkAccessToken } = UserMiddlewares;
const {
  handleFindContacts,
  handleFindFavorites,
  handleFindTrash,
  handleCreateContact,
  handleChangeFavoriteStatus,
  handleFindOneContacts,
  handleUpdateOneContact,
  handleChangeTrashStatus,
} = ContactsControllers;

const router = Router();

router
  .route('/contacts')
  .get(checkAccessToken, handleFindContacts)
  .post(checkAccessToken, handleCreateContact);

router
  .route('/contacts/:id')
  .get(checkAccessToken, handleFindOneContacts)
  .put(checkAccessToken, handleUpdateOneContact);
// router.route('/frequents').get(checkAccessToken);
router.route('/favorites').get(checkAccessToken, handleFindFavorites);
router
  .route('/favorites/:id')
  .patch(checkAccessToken, handleChangeFavoriteStatus);
router.route('/trash').get(checkAccessToken, handleFindTrash);
router.route('/trash/:id').patch(checkAccessToken, handleChangeTrashStatus);

export default router;
