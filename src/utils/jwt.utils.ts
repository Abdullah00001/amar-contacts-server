import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '@/interfaces/jwtPayload.interfaces';
import { env } from '@/env';
import {
  accessTokenExpiresIn,
  recoverSessionExpiresIn,
  refreshTokenExpiresIn,
} from '@/const';

const JwtUtils = {
  generateAccessToken: (payload: TokenPayload): string | null => {
    try {
      const token = jwt.sign(
        payload,
        env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
        {
          expiresIn: accessTokenExpiresIn,
        }
      );
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  generateRefreshToken: (payload: TokenPayload): string | null => {
    try {
      const token = jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: refreshTokenExpiresIn,
      });
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  verifyAccessToken: (token: string): JwtPayload | null => {
    try {
      const decoded = jwt.verify(
        token,
        env.JWT_ACCESS_TOKEN_SECRET_KEY
      ) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  verifyRefreshToken: (token: string): JwtPayload | null => {
    try {
      const decoded = jwt.verify(
        token,
        env.JWT_REFRESH_TOKEN_SECRET_KEY
      ) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  generateRecoverToken: (payload: TokenPayload): string | null => {
    try {
      const token = jwt.sign(
        payload,
        env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY,
        { expiresIn: recoverSessionExpiresIn }
      );
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default JwtUtils;
