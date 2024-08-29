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
const userModel_1 = __importDefault(require("../../infrastructure/database/model.ts/userModel")); // User's database model
const jwtUtils_1 = require("../../infrastructure/utils/jwtUtils");
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
const constants_1 = require("../../configs/constants");
const appError_1 = require("./appError");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const { message, decode } = (0, jwtUtils_1.jwtVerifyToken)(token, envConfig_1.default.JWT_SECRET_KEY);
        if (decode && decode.role == "user") {
            try {
                const user = yield userModel_1.default.findById(decode.userId);
                if (user && user.isBlocked) {
                    return res
                        .status(constants_1.STATUS_CODES.BLOCKED)
                        .json({ message: constants_1.MESSAGES.USER_BLOCKED });
                }
                if (user) {
                    req.userId = user._id;
                    next();
                }
            }
            catch (error) {
                console.log("Error fetching user:", error.message);
                next(new appError_1.AppError(constants_1.MESSAGES.RESOURCE_NOT_FOUND, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        }
        else {
            console.log("JWT Verification Error:", message);
            return res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({ message });
        }
    }
    else {
        return res
            .status(constants_1.STATUS_CODES.UNAUTHORIZED)
            .json({ message: "You are not authenticated!" });
    }
});
exports.default = authenticateUser;
