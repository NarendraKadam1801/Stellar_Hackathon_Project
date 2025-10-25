import jwt from 'jsonwebtoken';
import { ApiError } from './apiError.util.js';


interface TokenPayload {
  email?: string;
  NgoName?: string;
  walletAddr?: string;
  id?:string;
}

// Generate Access Token
const genAccessToken = async (user: TokenPayload) => {
  try {
    const { email, walletAddr, NgoName } = user;
    const secret: any = process.env.ATS;
    
    if (!secret || !user) {
      throw new ApiError(500, "Secret is missing or user info is invalid");
    }
    
    return await jwt.sign(
      {
        email,
        NgoName,
        walletAddr,
      },
      secret, // Access token secret
      {
        expiresIn: process.env.ATE // Access token expiry
      }
    );
  } catch (error) {
    throw new ApiError(500, "Unable to generate access token");
  }
};

// Generate Refresh Token
const genRefreshToken = async (user: TokenPayload) => {
  try {
    const { id,walletAddr } = user;
    const secret: any = process.env.RTS;
    
    if (!secret) {
      throw new ApiError(500, "Refresh token secret is missing");
    }
    
    return await jwt.sign(
      {
        id,
        walletAddr
      },
      secret,
      {
        expiresIn: process.env.RTE // Refresh token expiry
      }
    );
  } catch (error) {
    throw new ApiError(400, "Unable to generate refresh token");
  }
};

export { genAccessToken, genRefreshToken};
