import dotenv from 'dotenv';

// Load from .env file if it exists
dotenv.config();

// Set test environment variables with fallback values
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db';
process.env.REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_ACCESS_TOKEN_SECRET_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET_KEY || 'test-access-secret-key';
process.env.JWT_REFRESH_TOKEN_SECRET_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET_KEY || 'test-refresh-secret-key';
process.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY =
  process.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY || 'test-recover-secret-key';
process.env.SMTP_HOST = process.env.SMTP_HOST || 'smtp.test.com';
process.env.SMTP_PORT = process.env.SMTP_PORT || '587';
process.env.SMTP_USER = process.env.SMTP_USER || 'test@test.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'test-password';
process.env.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || 'test-cloudinary';
process.env.CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY || 'test-api-key';
process.env.CLOUDINARY_API_SECRET_KEY =
  process.env.CLOUDINARY_API_SECRET_KEY || 'test-api-secret';
