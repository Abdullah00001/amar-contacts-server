export const corsWhiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amar-contacts.vercel.app',
];
export const accessTokenExpiresIn = '30min';
export const refreshTokenExpiresIn = '7d';
export const otpExpireAt = 2;
export const refreshTokenBlackListExpAt = 30;
export const accessTokenBlackListExpAt = 1;
export const saltRound = 10;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
export const baseUrl = {
  v1: '/api/v1',
};
