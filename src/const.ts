import axios from 'axios';

export const corsWhiteList = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://amar-contacts.vercel.app',
  'https://amar-contacts.onrender.com',
];
export const accessTokenExpiresIn = '30min';
export const refreshTokenExpiresIn = '7d';
export const recoverSessionExpiresIn = '1d';
export const otpExpireAt = 2;
export const refreshTokenBlackListExpAt = 7;
export const accessTokenBlackListExpAt = 1;
export const RecoverTokenBlackListExpAt = 1;
export const saltRound = 10;
export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
export const baseUrl = {
  v1: '/api/v1',
};

export const getLocationFromIP = async (ip: string) => {
  try {
    // Using ip-api.com (free tier)
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

export const dashboardUrl = 'http://amar-contacts.vercel.app';
export const profileUrl = 'http://amar-contacts.vercel.app/me';
export const supportEmail = 'abdullahbinomarchowdhury02@gmail.com';
