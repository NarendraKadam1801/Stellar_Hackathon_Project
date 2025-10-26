import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../util/apiError.util.js";

interface RequestK extends Request {
    NgoId?: string;
    user?: any;
}

const verifyToken = async (req: RequestK, res: Response, next: NextFunction) => {
    try {
        // Get token from cookies or Authorization header
        let token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
        
        console.log('Token verification attempt:', {
            hasCookieToken: !!req.cookies?.accessToken,
            hasAuthHeader: !!req.headers.authorization,
            tokenLength: token ? token.length : 0,
            tokenStart: token ? token.substring(0, 20) + '...' : 'No token'
        });
        
        if (!token) {
            throw new ApiError(401, "Access token is required");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ATS || "your-secret-key") as any;
        
        console.log('Token decoded successfully:', {
            userId: decoded.userId,
            email: decoded.email,
            exp: decoded.exp,
            iat: decoded.iat
        });
        
        if (!decoded || !decoded.userId) {
            throw new ApiError(401, "Invalid token");
        }

        // Set NGO ID for use in controllers
        req.NgoId = decoded.userId;
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Token verification failed:', {
            error: error.message,
            name: error.name,
            stack: error.stack
        });
        
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export { verifyToken };
