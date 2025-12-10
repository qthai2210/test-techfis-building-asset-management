import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
 // BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
};

