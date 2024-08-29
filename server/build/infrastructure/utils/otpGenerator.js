"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = void 0;
class OTPGenerator {
    generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    }
}
exports.otpGenerator = new OTPGenerator();
