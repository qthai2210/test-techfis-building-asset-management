import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
 // BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:22102003@localhost:5433/techfis_asset_management?schema=public',
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || 'your-secret-key-here',
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || 'your-refresh-secret-here',
};

