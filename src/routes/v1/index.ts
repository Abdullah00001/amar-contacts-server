import { Router } from 'express';
import UserRoutes from './user.routes';

const routes: Router[] = [UserRoutes];

const v1Routes = Router();

routes.forEach((route) => v1Routes.use(route));

export default v1Routes;
