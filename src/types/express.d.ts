import { TokenPayload } from "../interfaces/jwtPayload.interfaces";
import { IUser } from "../modules/user/user.interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      decoded:TokenPayload
    }
  }
}
