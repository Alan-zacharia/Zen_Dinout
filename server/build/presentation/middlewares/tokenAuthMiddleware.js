"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
const jwtUtils_1 = require("../../infrastructure/utils/jwtUtils");
function refreshAccessToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.cookies.refreshToken;
        console.log("Refresh Token");
        if (!refreshToken) {
            return res.status(402).json({ message: 'No refresh token provided' });
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        try {
            const accessToken = (0, jwtUtils_1.jwtGenerateToken)(decoded.userId, decoded.role);
            return res.status(200).json({ accessToken });
        }
        catch (error) {
            console.error('Error generating new access token:', error);
            return res.status(500).json({ message: 'Failed to generate new access token' });
        }
    });
}
exports.refreshAccessToken = refreshAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, envConfig_1.default.JWT_REFRESH_SECRET_KEY);
    }
    catch (error) {
        console.error('Error verifying refresh token:', error);
        return null;
    }
};
