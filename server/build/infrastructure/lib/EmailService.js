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
const nodemailer_1 = __importDefault(require("nodemailer"));
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: envConfig_1.default.EMAIL,
                pass: envConfig_1.default.MAILER_PASS_KEY,
            },
        });
    }
    sendMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield this.transporter.sendMail(options);
                console.log("Email sent: ", info.response);
                return { success: true };
            }
            catch (error) {
                console.error("Error sending email: ", error);
                return { success: false };
            }
        });
    }
    sendOtpEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlContent = `
          <p>Dear User,</p>
          <p>Thank you for using our service. As requested, here is your One-Time Password:</p>
          <h2 style="color: green;"><strong>${otp}</strong></h2>
          <p>Please use this OTP within the specified time limit to complete your authentication. Do not share this OTP with anyone, as it is valid for a single use only.</p>
          <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
          <p>Thank you,</p>
          <p>Zen Dinout</p>
        `;
            return this.sendMail({
                from: envConfig_1.default.EMAIL,
                to: email,
                subject: "Zen-Dinout Verification code.",
                html: htmlContent,
            });
        });
    }
    sendRegistrationConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlContent = `
          <p>Your registration on Zen-Dinout is completed. Please wait for the confirmation.</p>
        `;
            return this.sendMail({
                from: envConfig_1.default.EMAIL,
                to: email,
                subject: "Zen-Dinout Registration Confirmation",
                html: htmlContent,
            });
        });
    }
    sendRestaurantConfrimationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlContent = `<p>Dear Restaurant,</p>
  <p>Thank you for using our service. As requested , your restaurant is confirmed</p>
  <h2 style="color : green"><strong><a href='${envConfig_1.default.CLIENT_URL}/login'>Login Your account</a></strong></h2>
  <p>If you did not request have any concerns, please contact our support team immediately.</p>
  <p>Thank you,</p>
  <p>Zen Dinout</p>`;
            return this.sendMail({
                from: envConfig_1.default.EMAIL,
                to: email,
                subject: "Zen-Dinout Confirmation Email",
                html: htmlContent,
            });
        });
    }
    sendRestaurantRejectionEmail(email, rejectReason) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlContent = `<p>Dear Restaurant,</p>
  <p>As requested, your restaurant request has been rejected.</p>
  <p>Reason : ${rejectReason}</p>
  <p>If you did not request this or have any concerns, please contact our support team immediately.</p>
  <p>Thank you,</p>
  <p>Zen Dinout</p>`;
            return this.sendMail({
                from: envConfig_1.default.EMAIL,
                to: email,
                subject: "Zen-Dinout Registration Confirmation",
                html: htmlContent,
            });
        });
    }
    sendPasswordResetEmail(email, passwordResetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const htmlContent = `
          <p>Dear user,</p>
  <p>Please click this link for your reset-password</p>
  <button style="background-color : red; width:150px; height : 50px; border-radius: 12px; cursor: pointer; border:none;"><a href='${envConfig_1.default.CLIENT_URL}/reset-password/fps/:${passwordResetToken}' style="text-decoration: none; color: #ffffff; font-size: 16px; font-family: sans-serif; font-weight: 600;">Reset password</a></button>
  <p>If you did not request have any concerns, please contact our support team immediately.</p>
  <p>Thank you,</p>
  <p>Zen Dinout</p>
        `;
            return this.sendMail({
                from: envConfig_1.default.EMAIL,
                to: email,
                subject: "Zen-Dinout Reset password.",
                html: htmlContent,
            });
        });
    }
    sendReminderEmail(email, subject, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendMail({
                from: envConfig_1.default.EMAIL,
                to: email,
                subject: subject,
                text: content,
            });
        });
    }
}
exports.default = new EmailService();
