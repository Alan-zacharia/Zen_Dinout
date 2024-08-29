"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configuredKeys = {
    PORT: process.env.PORT || 5000,
    DB_HOST: process.env.DB_HOST,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    EMAIL: process.env.EMAIL,
    MAILER_PASS_KEY: process.env.MAILER_PASS_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
exports.default = configuredKeys;
