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
exports.userInteractorImpl = void 0;
const constants_1 = require("../../configs/constants");
const Wintson_1 = __importDefault(require("../../infrastructure/lib/Wintson"));
class userInteractorImpl {
    constructor(repository) {
        this.repository = repository;
    }
    registerUserInteractor(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = credentials;
            if (!email || !username || !password) {
                return { user: null, message: constants_1.MESSAGES.INVALID_REGISTER };
            }
            try {
                const result = yield this.repository.registerUserRepo(credentials);
                const { message, user } = result;
                return { user, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    loginUserInteractor(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = credentials;
            if (!email || !password) {
                return {
                    user: null,
                    message: constants_1.MESSAGES.INVALID_FORMAT,
                    token: null,
                    refreshToken: null,
                };
            }
            try {
                const result = yield this.repository.loginUserRepo(email, password);
                const { message, user, refreshToken, token } = result;
                return { user, message, token, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    googleLoginInteractor(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, username } = credentials;
            if (!password || !email) {
                return {
                    user: null,
                    message: constants_1.MESSAGES.INVALID_FORMAT,
                    token: null,
                    refreshToken: null,
                };
            }
            try {
                const loginResult = yield this.repository.loginUserRepo(email, password);
                if (loginResult.user) {
                    return {
                        message: loginResult.message,
                        user: loginResult.user,
                        token: loginResult.token,
                        refreshToken: loginResult.refreshToken,
                    };
                }
                const { message, user, token, refreshToken } = yield this.repository.googleLoginRepo(credentials);
                return { message, user, token, refreshToken };
            }
            catch (error) {
                Wintson_1.default.error(error);
                throw error;
            }
        });
    }
    generateOtpInteractor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return { message: constants_1.MESSAGES.INVALID_EMAIL_FORMAT, otp: null };
            }
            try {
                const { message, otp } = yield this.repository.generateOtpRepo(email);
                return { message, otp };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPasswordRequestInteractor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return { message: constants_1.MESSAGES.INVALID_EMAIL_FORMAT, success: false };
            }
            try {
                const { message, success } = yield this.repository.resetPasswordRequestRepo(email);
                return { message, success };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getProfileInteractor(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return { userDetails: null, status: false };
            }
            try {
                const result = yield this.repository.getProfileRepo(userId);
                const { status, userDetails } = result;
                return { userDetails, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getListedRestuarantInteractor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { listedRestaurants } = yield this.repository.getListedRestuarantRepo();
                return { listedRestaurants };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantDetailedViewInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { restaurant: null, status: false, restaurantImages: null };
            }
            try {
                const { restaurant, status, restaurantImages } = yield this.repository.getRestaurantDetailedViewRepo(restaurantId);
                return { restaurant, restaurantImages, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPasswordUpdateInteractor(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !password) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const { message, status } = yield this.repository.resetPasswordUpdateRepo(userId, password);
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUserProfileInteractor(userId, datas) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return { updatedUser: null, status: false };
            }
            try {
                const result = yield this.repository.updateUserProfileRepo(userId, datas);
                const { updatedUser, status } = result;
                return { updatedUser, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBookingDataInteractor(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return { bookingData: null, status: false };
            }
            try {
                const result = yield this.repository.getBookingDataRepo(userId);
                const { bookingData, status } = result;
                return { bookingData, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBookingDetailedInteractor(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId) {
                return { bookingData: null, status: false };
            }
            try {
                const result = yield this.repository.getBookingDetailedRepo(bookingId);
                const { bookingData, status } = result;
                return { bookingData, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelBookingInteractor(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId) {
                return { bookingData: null, status: false };
            }
            try {
                const result = yield this.repository.cancelBookingRepo(bookingId);
                const { bookingData, status } = result;
                return { bookingData, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserWalletInteractor(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return { wallet: null, status: false };
            }
            try {
                const result = yield this.repository.getUserWalletRepo(userId);
                const { wallet, status } = result;
                return { wallet, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCouponsInteractor(date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!date) {
                return { coupons: null, status: false };
            }
            try {
                const result = yield this.repository.getCouponsRepo(date);
                const { coupons, status } = result;
                return { coupons, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveRestaurantInteractor(restaurantId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !restaurantId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const result = yield this.repository.saveRestaurantRepo(restaurantId, userId);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSavedRestaurantInteractor(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return { savedRestaurants: null, status: false };
            }
            try {
                const result = yield this.repository.getSavedRestaurantRepo(userId);
                const { savedRestaurants, status } = result;
                return { savedRestaurants, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCheckSavedRestaurantInteractor(restaurantId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !restaurantId) {
                return { isBookmark: false, status: false };
            }
            try {
                const result = yield this.repository.getCheckSavedRestaurantRepo(restaurantId, userId);
                const { isBookmark, status } = result;
                return { isBookmark, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addReviewInteractor(reviewDatas, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating, restaurantId, reviewText } = reviewDatas;
            if (!userId || !restaurantId || !rating || !reviewText) {
                return { status: false, message: constants_1.MESSAGES.INVALID_FORMAT };
            }
            try {
                const result = yield this.repository.addReviewRepo(reviewDatas, userId);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReviewsInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { reviews: null, status: false, message: constants_1.MESSAGES.INVALID_FORMAT };
            }
            try {
                const result = yield this.repository.getReviewsRepo(restaurantId);
                const { message, reviews, status } = result;
                return { message, reviews, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReviewInteractor(restaurantId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !userId) {
                return { review: null, status: false, message: constants_1.MESSAGES.INVALID_FORMAT };
            }
            try {
                const result = yield this.repository.getReviewRepo(restaurantId, userId);
                const { message, review, status } = result;
                return { message, review, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantTableInteractor(restaurantId, tableSize, slot, selectedDate, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !tableSize || !slot || !selectedDate) {
                return {
                    availableTables: null,
                    status: false,
                    message: constants_1.MESSAGES.INVALID_FORMAT,
                    totalTables: 0,
                    tablesPerPage: 0,
                };
            }
            try {
                const result = yield this.repository.getRestaurantTableRepo(restaurantId, tableSize, slot, selectedDate, page);
                const { message, availableTables, status, totalTables, tablesPerPage } = result;
                return { message, availableTables, status, totalTables, tablesPerPage };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTimeSlotInteractor(restaurantId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !date) {
                return {
                    TimeSlots: null,
                    status: false,
                };
            }
            try {
                const result = yield this.repository.getTimeSlotRepo(restaurantId, date);
                const { TimeSlots, status } = result;
                return { TimeSlots, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createBookingInteractor(userId, bookingComfirmationDatas, totalCost) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingTime, Date, paymentMethod, restaurantDatas, timeSlotId } = bookingComfirmationDatas;
            if (!userId ||
                !bookingTime ||
                !Date ||
                !paymentMethod ||
                !restaurantDatas ||
                !timeSlotId) {
                return { status: false, bookingId: null, bookingUsingWallet: false };
            }
            try {
                const result = paymentMethod == "Wallet"
                    ? yield this.repository.createBookingUsingWalletRepo(userId, bookingComfirmationDatas, totalCost)
                    : yield this.repository.createBookingRepo(userId, bookingComfirmationDatas, totalCost);
                const bookingUsingWallet = paymentMethod == "Wallet";
                const { bookingId, status } = result;
                return { bookingId, status, bookingUsingWallet };
            }
            catch (error) {
                throw error;
            }
        });
    }
    bookingStatusUpdationInteractor(bookingId, paymentStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookingId || !paymentStatus) {
                return { status: false };
            }
            try {
                const result = yield this.repository.bookingStatusUpdationRepo(bookingId, paymentStatus);
                const { status } = result;
                return { status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMembershipPaymentInteractor(userId, membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !membershipId) {
                return { status: false, sessionId: null };
            }
            try {
                const result = yield this.repository.createMembershipPaymentRepo(userId, membershipId);
                const { status, sessionId } = result;
                return { status, sessionId };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMembershipInteractor(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return { status: false, memberships: null, existingMembership: null };
            }
            try {
                const result = yield this.repository.getMembershipRepo(userId);
                const { status, existingMembership, memberships } = result;
                return { status, existingMembership, memberships };
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelMembershipIntearctor(userId, membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !membershipId) {
                return { status: false, message: constants_1.MESSAGES.INVALID_FORMAT };
            }
            try {
                const result = yield this.repository.cancelMembershipRepo(userId, membershipId);
                const { status, message } = result;
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    applyCouponInteractor(couponCode, minPurchase, todayDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!couponCode || !minPurchase || !todayDate) {
                return { status: false, message: constants_1.MESSAGES.INVALID_FORMAT, coupon: null };
            }
            try {
                const result = yield this.repository.applyCouponRepo(couponCode, minPurchase, todayDate);
                const { status, message, coupon } = result;
                return { status, message, coupon };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.userInteractorImpl = userInteractorImpl;
