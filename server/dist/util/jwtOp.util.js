import jwt from 'jsonwebtoken';
import { ApiError } from './apiError.util.js';
// Generate Access Token
const genAccessToken = async (user) => {
    try {
        const { email, walletAddr, NgoName } = user;
        const secret = process.env.ATS;
        if (!secret || !user) {
            throw new ApiError(500, "Secret is missing or user info is invalid");
        }
        return jwt.sign({
            email,
            NgoName,
            walletAddr,
        }, secret, // Access token secret
        {
            expiresIn: process.env.ATE || "15m" // Access token expiry
        });
    }
    catch (error) {
        throw new ApiError(500, "Unable to generate access token");
    }
};
// Generate Refresh Token
const genRefreshToken = async (user) => {
    try {
        const { id, walletAddr } = user;
        const secret = process.env.RTS;
        if (!secret) {
            throw new ApiError(500, "Refresh token secret is missing");
        }
        return jwt.sign({
            id,
            walletAddr
        }, secret, {
            expiresIn: process.env.RTE || "7d" // Refresh token expiry
        });
    }
    catch (error) {
        throw new ApiError(400, "Unable to generate refresh token");
    }
};
export { genAccessToken, genRefreshToken };
//# sourceMappingURL=jwtOp.util.js.map