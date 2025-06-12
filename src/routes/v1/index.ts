import { Router } from 'express';
import UserRoutes from '@/routes/v1/user.routes';
import ContactsRoutes from '@/routes/v1/contacts.routes';
import ProfileRoutes from '@/routes/v1/profile.routes';

const routes: Router[] = [UserRoutes, ContactsRoutes, ProfileRoutes];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
