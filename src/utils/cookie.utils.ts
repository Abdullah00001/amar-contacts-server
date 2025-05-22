import { env } from '@/env';
import CookieOptions from '@/interfaces/cookie.interface';

const cookieOption = (
  min?: number | null,
  day?: number | null
): CookieOptions => {
  const option: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    domain:
      env.NODE_ENV === 'production' ? '.amar-contacts.vercel.app' : 'localhost',
  };

  if (min) {
    option.maxAge = min * 60 * 1000;
  }
  if (day) {
    option.maxAge = day * 24 * 60 * 60 * 1000;
  }

  return option;
};

export default cookieOption;
