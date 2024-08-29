"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const envConfig_1 = __importDefault(require("../configs/envConfig"));
cloudinary_1.v2.config({
    cloud_name: envConfig_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig_1.default.CLOUDINARY_API_KEY,
    api_secret: envConfig_1.default.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
