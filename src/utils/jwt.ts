import { config } from '../config';
import jwt from 'jsonwebtoken';

// Constants
export const ACCESS_TOKEN_EXPIRY = '180h';
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

// Types and Interfaces
export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// Generate Refresh Token and Access Token
export const generateTokens = (id: string) => {
  const payload: TokenPayload = { userId: id };

  const accessToken = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

// Generate Access Token
export const generateAccessToken = (id: string) => {
  const accessToken = jwt.sign({ userId: id }, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  return accessToken;
};

// Generate Refresh Token
export const generateRefreshToken = (id: string) => {
  const refreshToken = jwt.sign({ userId: id }, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return refreshToken;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_REFRESH_TOKEN_SECRET) as TokenPayload;
};