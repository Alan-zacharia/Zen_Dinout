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
exports.membershipCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const userModel_1 = __importDefault(require("../../database/model.ts/userModel"));
const dateUtils_1 = require("../../utils/dateUtils");
const EmailService_1 = __importDefault(require("../../lib/EmailService"));
const membershipCronJob = () => {
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Running CRON job to check for expiring memberships.");
        try {
            const today = new Date();
            const reminderDate = new Date(today);
            reminderDate.setDate(today.getDate() + 7);
            const usersToRemind = yield userModel_1.default.find({
                "primeSubscription.endDate": {
                    $gte: today,
                    $lte: reminderDate,
                },
                "primeSubscription.status": "active",
            });
            const usersToDeactivate = yield userModel_1.default.find({
                "primeSubscription.endDate": { $lt: today },
                "primeSubscription.status": "active",
            });
            usersToDeactivate.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
                if (user.primeSubscription) {
                    yield userModel_1.default.findByIdAndUpdate(user._id, {
                        $set: {
                            "primeSubscription.status": "inactive",
                            "primeSubscription.endDate": user.primeSubscription.endDate,
                        },
                    });
                    console.log(`Membership for user ${user.username} has been deactivated.`);
                }
            }));
            usersToRemind.forEach((user) => {
                if (user.primeSubscription) {
                    const { username, email, primeSubscription } = user;
                    const emailContent = `Hello ${username},\n\nYour membership is expiring in 7 days on ${(0, dateUtils_1.getFormattedDate)(primeSubscription.endDate)}. Please renew it to continue enjoying our services.\n\nBest regards,\nZen Dinout`;
                    EmailService_1.default.sendReminderEmail(email, "Membership Expiration Reminder", emailContent).catch((error) => {
                        console.error(`Error sending email to ${email}:`, error);
                    });
                }
            });
        }
        catch (error) {
            console.error("Error in CRON job:", error);
        }
    }));
};
exports.membershipCronJob = membershipCronJob;
