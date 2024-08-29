"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.jwtVerifyToken = exports.jwtGenerateRefreshToken = exports.jwtGenerateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
const constants_1 = require("../../configs/constants");
/** JWT TOKEN GENERATION */
const jwtGenerateToken = (userId, role) => {
    const payload = {
        userId: userId,
        role: role
    };
    return jsonwebtoken_1.default.sign(payload, envConfig_1.default.JWT_SECRET_KEY, { expiresIn: constants_1.JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN });
};
exports.jwtGenerateToken = jwtGenerateToken;
/** JWT REFRESH TOKEN */
const jwtGenerateRefreshToken = (userId, role) => {
    const payload = {
        userId: userId,
        role: role
    };
    return jsonwebtoken_1.default.sign(payload, envConfig_1.default.JWT_REFRESH_SECRET_KEY, {
        expiresIn: constants_1.JWT_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.jwtGenerateRefreshToken = jwtGenerateRefreshToken;
/** JWT VERIFY TOKEN */
const jwtVerifyToken = (accessToken, SECRET_KEY) => {
    try {
        const decode = jsonwebtoken_1.default.verify(accessToken, SECRET_KEY);
        return { message: "Verified successfully", decode };
    }
    catch (err) {
        return { message: "Invalid Token", decode: null };
    }
};
exports.jwtVerifyToken = jwtVerifyToken;
/** GENERATE TOKENS */
const generateTokens = (id, role) => {
    const generatedAccessToken = (0, exports.jwtGenerateToken)(id, role);
    const generatedRefreshToken = (0, exports.jwtGenerateRefreshToken)(id, role);
    return { generatedAccessToken, generatedRefreshToken };
};
exports.generateTokens = generateTokens;
