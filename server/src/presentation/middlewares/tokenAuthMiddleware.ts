import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import configuredKeys from "../../configs/envConfig";
import { jwtGenerateToken } from "../../infrastructure/utils/jwtUtils";

export async function refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh Token")
    if (!refreshToken) {
        return res.status(402).json({ message: 'No refresh token provided' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }

    try {
        const accessToken = jwtGenerateToken(decoded.userId, "user");
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error generating new access token:', error);
        return res.status(500).json({ message: 'Failed to generate new access token' });
    }
}

const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, configuredKeys.JWT_REFRESH_SECRET_KEY) as JwtPayload;
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return null;
    }
};
