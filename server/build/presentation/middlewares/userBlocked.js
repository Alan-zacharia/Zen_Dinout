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
exports.blockedUserCheck = void 0;
const userModel_1 = __importDefault(require("../../infrastructure/database/model.ts/userModel"));
const express_validator_1 = require("express-validator");
const constants_1 = require("../../configs/constants");
const appError_1 = require("./appError");
const blockedUserCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("gyggg");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        return res.status(400).json({ message: errorMessage });
    }
    const { email } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (user && user.isBlocked) {
            return res
                .status(constants_1.STATUS_CODES.BLOCKED)
                .json({ message: constants_1.MESSAGES.USER_BLOCKED });
        }
        next();
    }
    catch (error) {
        next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
    }
});
exports.blockedUserCheck = blockedUserCheck;
