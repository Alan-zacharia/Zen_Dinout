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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryImpl = void 0;
const userModel_1 = __importDefault(require("../database/model/userModel"));
const Wintson_1 = __importDefault(require("../lib/Wintson"));
const restaurantModel_1 = __importDefault(require("../database/model/restaurantModel"));
const constants_1 = require("../../configs/constants");
const jwtUtils_1 = require("../utils/jwtUtils");
const EmailService_1 = __importDefault(require("../lib/EmailService"));
const bookingModel_1 = __importDefault(require("../database/model/bookingModel"));
const wallet_1 = __importDefault(require("../database/model/wallet"));
const couponModel_1 = __importDefault(require("../database/model/couponModel"));
const bookMarkModel_1 = __importDefault(require("../database/model/bookMarkModel"));
const reviewModel_1 = __importDefault(require("../database/model/reviewModel"));
const restaurantTable_1 = __importDefault(require("../database/model/restaurantTable"));
const generateBookingId_1 = require("../utils/generateBookingId");
const otpGenerator_1 = require("../utils/otpGenerator");
const auth_1 = require("../../domain/entities/auth");
const restaurantTimeSlot_1 = __importDefault(require("../database/model/restaurantTimeSlot"));
const membershipModel_1 = __importDefault(require("../database/model/membershipModel"));
const stripeMembershipService_1 = __importDefault(require("../payment/stripeMembershipService"));
const menuModel_1 = __importDefault(require("../database/model/menuModel"));
class userRepositoryImpl {
    findExistingUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email });
                return !!user;
            }
            catch (error) {
                throw new Error("Failed to find user. Please try again later.");
            }
        });
    }
    registerUserRepo(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = user;
            try {
                const isExist = yield this.findExistingUser(email);
                if (isExist) {
                    return {
                        user: null,
                        message: constants_1.MESSAGES.USER_ALREADY_EXISTS,
                    };
                }
                const newUser = new userModel_1.default({
                    username,
                    email,
                    password,
                });
                yield newUser.save();
                return {
                    user: newUser,
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    loginUserRepo(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email: email });
                if (!user) {
                    return {
                        user: null,
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                        token: null,
                        refreshToken: null,
                    };
                }
                const isValidPassword = yield (0, auth_1.hashedPasswordCompare)(password, user.password);
                if (isValidPassword) {
                    const { generatedAccessToken, generatedRefreshToken } = (0, jwtUtils_1.generateTokens)(user._id, constants_1.ROLES.USER);
                    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
                    return {
                        user: userWithoutPassword,
                        message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                        token: generatedAccessToken,
                        refreshToken: generatedRefreshToken,
                    };
                }
                else {
                    return {
                        user: null,
                        message: constants_1.MESSAGES.INVALID_PASSWORD,
                        token: null,
                        refreshToken: null,
                    };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    googleLoginRepo(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = credentials;
            try {
                const user = new userModel_1.default({
                    username: username,
                    email: email,
                    password: password,
                });
                yield user.save();
                const { generatedAccessToken, generatedRefreshToken } = (0, jwtUtils_1.generateTokens)(user._id, constants_1.ROLES.USER);
                return {
                    user: user,
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                    token: generatedAccessToken,
                    refreshToken: generatedRefreshToken,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    generateOtpRepo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = otpGenerator_1.otpGenerator.generateOtp();
                yield EmailService_1.default.sendOtpEmail(email, otp);
                Wintson_1.default.info(`Otp : ${otp}`);
                return { message: "Otp Sended successfully", otp };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getProfileRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield userModel_1.default
                    .findById(userId)
                    .select("-password")
                    .populate("primeSubscription.membershipId", "discount");
                if (!userDetails) {
                    return { status: false, userDetails: null };
                }
                return { status: true, userDetails: userDetails };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUserProfileRepo(userId, datas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield userModel_1.default
                    .findByIdAndUpdate(userId, {
                    username: datas.username,
                    phone: datas.phone,
                }, { upsert: true, new: true })
                    .select("-password");
                if (!updatedUser) {
                    return { status: false, updatedUser: null };
                }
                return { status: true, updatedUser: updatedUser.toObject() };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getListedRestuarantRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listedRestaurants = yield restaurantModel_1.default.aggregate([
                    { $match: { isApproved: true } },
                    {
                        $match: {
                            $and: [
                                { featuredImage: { $exists: true } },
                                { address: { $exists: true } },
                            ],
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    {
                        $project: {
                            password: 0,
                        },
                    },
                ]);
                return { listedRestaurants: listedRestaurants };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantDetailedViewRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let restaurantImages = [];
                const restaurant = yield restaurantModel_1.default
                    .findById(restaurantId)
                    .select("-password");
                if (!restaurant) {
                    return { restaurant: null, status: false, restaurantImages: null };
                }
                if (restaurant.featuredImage && restaurant.featuredImage.url) {
                    restaurantImages.push(restaurant.featuredImage.url);
                }
                (_a = restaurant.secondaryImages) === null || _a === void 0 ? void 0 : _a.map((image) => {
                    if (image.url) {
                        restaurantImages.push(image.url);
                    }
                });
                return {
                    restaurant: restaurant.toObject(),
                    restaurantImages,
                    status: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPasswordRequestRepo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    return { message: constants_1.MESSAGES.RESOURCE_NOT_FOUND, success: false };
                }
                EmailService_1.default.sendPasswordResetEmail(user.email, user._id);
                return { message: "Successs...", success: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPasswordUpdateRepo(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hashedPassword } = yield (0, auth_1.hashedPasswordFunction)(password);
                const user = yield userModel_1.default.findByIdAndUpdate(userId, {
                    password: hashedPassword,
                });
                if (!user) {
                    return { message: constants_1.MESSAGES.RESOURCE_NOT_FOUND, status: false };
                }
                return { message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBookingDataRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.default
                    .find({ userId })
                    .populate("table", "tableNumber")
                    .populate("restaurantId", "_id restaurantName featuredImage tableRate")
                    .populate("userId", "username email")
                    .sort({ createdAt: 1 });
                const bookingData = bookings.map((data) => {
                    return data.toObject();
                });
                return { bookingData: bookingData, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBookingDetailedRepo(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = yield bookingModel_1.default
                    .findOne({ bookingId })
                    .populate("table", "tableNumber")
                    .populate("restaurantId", "_id restaurantName featuredImage tableRate")
                    .populate("userId", "username email");
                console.log(bookingData);
                if (!bookingData) {
                    return { bookingData: null, status: false };
                }
                return { bookingData: bookingData.toObject(), status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelBookingRepo(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancelBookingData = yield bookingModel_1.default.findOneAndUpdate({ bookingId }, {
                    bookingStatus: "CANCELLED",
                    paymentStatus: "REFUNDED",
                });
                if (!cancelBookingData) {
                    return { bookingData: null, status: false };
                }
                const wallet = yield wallet_1.default.findOne({ userId: cancelBookingData.userId });
                if (wallet) {
                    const amount = cancelBookingData.totalAmount;
                    wallet.balance += amount;
                    wallet.transactions.push({
                        amount,
                        type: "credit",
                        description: "Added funds",
                    });
                    yield wallet.save();
                }
                return { bookingData: cancelBookingData.toObject(), status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserWalletRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield wallet_1.default.findOne({ userId });
                if (!wallet) {
                    return { wallet: null, status: false };
                }
                return { wallet: wallet.toObject(), status: false };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCouponsRepo(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupons = yield couponModel_1.default.find({
                    expiryDate: { $gte: date },
                });
                const couponsList = coupons.map((data) => {
                    return data.toObject();
                });
                return { coupons: couponsList, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveRestaurantRepo(restaurantId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingBookmark = yield bookMarkModel_1.default.findOne({
                    userId,
                    restaurantId,
                });
                console.log(existingBookmark, restaurantId, userId);
                if (existingBookmark) {
                    yield bookMarkModel_1.default.deleteOne({
                        userId,
                        restaurantId,
                    });
                    return { message: "Restaurant removed....", status: true };
                }
                const savedRestaurant = new bookMarkModel_1.default({
                    userId,
                    restaurantId,
                });
                console.log(savedRestaurant);
                yield savedRestaurant.save();
                return { message: "Restaurant added...", status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getSavedRestaurantRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedRestaurantList = yield bookMarkModel_1.default
                    .find({ userId })
                    .populate("restaurantId");
                const savedRestaurants = savedRestaurantList.map((data) => {
                    return data.toObject();
                });
                return { savedRestaurants: savedRestaurants, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCheckSavedRestaurantRepo(restaurantId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedRestaurant = yield bookMarkModel_1.default.findOne({
                    restaurantId,
                    userId,
                });
                if (!savedRestaurant) {
                    return { isBookmark: false, status: true };
                }
                return { isBookmark: true, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createBookingRepo(userId, bookingComfirmationDatas, totalCost) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingTime, Date, paymentMethod, restaurantDatas, timeSlotId } = bookingComfirmationDatas;
            const { Capacity, price, restaurantId, subTotal, table } = restaurantDatas;
            try {
                const newBooking = new bookingModel_1.default({
                    bookingId: (0, generateBookingId_1.generateBookingId)(),
                    userId,
                    table,
                    restaurantId,
                    timeSlot: timeSlotId,
                    guestCount: Capacity,
                    bookingDate: Date,
                    bookingTime,
                    paymentMethod,
                    totalAmount: price,
                    subTotal,
                });
                yield newBooking.save();
                if (!newBooking) {
                    return { status: false, bookingId: null };
                }
                return { bookingId: newBooking.bookingId, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createBookingUsingWalletRepo(userId, bookingComfirmationDatas, totalCost) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookingTime, Date, paymentMethod, restaurantDatas, timeSlotId } = bookingComfirmationDatas;
            const { Capacity, price, restaurantId, subTotal, table } = restaurantDatas;
            try {
                const wallet = yield wallet_1.default.findOne({ userId });
                if (!wallet || (wallet && wallet.balance < parseInt(price))) {
                    return { status: false, bookingId: null };
                }
                const newBooking = new bookingModel_1.default({
                    bookingId: (0, generateBookingId_1.generateBookingId)(),
                    userId,
                    table,
                    restaurantId,
                    timeSlot: timeSlotId,
                    guestCount: Capacity,
                    bookingDate: Date,
                    bookingTime,
                    paymentMethod,
                    totalAmount: price,
                    subTotal,
                });
                if (!newBooking) {
                    return { status: false, bookingId: null };
                }
                newBooking.paymentStatus = "PAID";
                newBooking.bookingStatus = "CONFIRMED";
                wallet.balance -= parseInt(price);
                wallet.transactions.push({
                    amount: price,
                    type: "debit",
                    description: "Booking payment",
                });
                yield newBooking.save();
                yield wallet.save();
                console.log(newBooking);
                return { bookingId: newBooking.bookingId, status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    addReviewRepo(reviewDatas, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating, restaurantId, reviewText } = reviewDatas;
            try {
                const newReview = yield reviewModel_1.default.findOneAndUpdate({ userId, restaurantId }, { reviewText, rating }, { upsert: true, new: true, setDefaultsOnInsert: true });
                if (!newReview) {
                    return { message: "Review not added", status: false };
                }
                return {
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReviewsRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewsList = yield reviewModel_1.default
                    .find({
                    restaurantId,
                })
                    .populate("userId", "username");
                const reviews = reviewsList.map((data) => {
                    return data.toObject();
                });
                return {
                    reviews: reviews,
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMenuRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menuList = yield menuModel_1.default.findOne({
                    restaurantId,
                });
                if (!menuList) {
                    return {
                        menu: null,
                        status: true,
                        message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    };
                }
                return {
                    menu: menuList.toObject(),
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReviewRepo(restaurantId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield reviewModel_1.default.findOne({
                    restaurantId,
                    userId,
                });
                if (!review) {
                    return {
                        status: false,
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                        review: null,
                    };
                }
                return {
                    review: review === null || review === void 0 ? void 0 : review.toObject(),
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantTableRepo(restaurantId, tableSize, slot, selectedDate, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tablesPerPage = 4;
                const bookedTables = yield bookingModel_1.default
                    .find({
                    restaurantId,
                    timeSlot: slot,
                    bookingDate: new Date(selectedDate),
                    bookingStatus: { $ne: "CANCELLED" },
                })
                    .select("table");
                const bookedTableIds = bookedTables.map((booking) => booking.table);
                const totalTables = yield restaurantTable_1.default.countDocuments({
                    restaurantId,
                    tableCapacity: { $gte: tableSize },
                    _id: { $nin: bookedTableIds },
                });
                const availableTables = yield restaurantTable_1.default
                    .find({
                    restaurantId,
                    tableCapacity: { $gte: tableSize },
                    _id: { $nin: bookedTableIds },
                })
                    .skip(page * 1 - 1)
                    .limit(tablesPerPage)
                    .sort({ tableCapacity: 1 });
                if (!availableTables.length) {
                    return {
                        status: true,
                        message: constants_1.MESSAGES.NO_TABLES_AVAILABLE,
                        availableTables: [],
                        totalTables: 0,
                        tablesPerPage: 0,
                    };
                }
                const tables = availableTables.map((table) => {
                    return table.toObject();
                });
                return {
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    availableTables: tables,
                    totalTables,
                    tablesPerPage,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTimeSlotRepo(restaurantId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
                const allTimeSlots = yield restaurantTimeSlot_1.default.find({ restaurantId, date });
                const bookedTimeSlots = yield bookingModel_1.default
                    .find({
                    restaurantId,
                    bookingDate: date,
                    bookingStatus: { $ne: "CANCELLED" },
                })
                    .select("timeSlot");
                const table = yield restaurantTable_1.default.find({ restaurantId });
                const totalTables = table.length || 0;
                const bookingCountMap = {};
                bookedTimeSlots.forEach((booking) => {
                    const timeSlotId = booking.timeSlot.toString();
                    bookingCountMap[timeSlotId] = (bookingCountMap[timeSlotId] || 0) + 1;
                });
                const availableTimeSlots = allTimeSlots.filter((timeSlot) => {
                    const timeSlotDateTime = new Date(timeSlot.date + "T" + timeSlot.time.toISOString().split("T")[1]);
                    const isBooked = (bookingCountMap[timeSlot._id.toString()] || 0) >= totalTables;
                    const isAvailable = timeSlot.isAvailable && !isBooked;
                    const isAfterOneHour = timeSlotDateTime >= oneHourFromNow;
                    return isAvailable && isAfterOneHour;
                });
                const TimeSlots = availableTimeSlots.map((data) => data.toObject());
                return { TimeSlots, status: true };
            }
            catch (error) {
                console.error("Error in getTimeSlotRepo:", error);
                return { TimeSlots: null, status: false };
            }
        });
    }
    bookingStatusUpdationRepo(bookingId, paymentStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(paymentStatus, bookingId);
                const bookingData = yield bookingModel_1.default.findOne({ bookingId });
                if (!bookingData) {
                    return {
                        status: false,
                    };
                }
                if (paymentStatus == "PAID") {
                    bookingData.paymentStatus = paymentStatus;
                    bookingData.bookingStatus = "CONFIRMED";
                }
                else if (paymentStatus == "FAILED") {
                    bookingData.paymentStatus = paymentStatus;
                    bookingData.bookingStatus = "CANCELLED";
                }
                yield bookingData.save();
                return {
                    status: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMembershipPaymentRepo(userId, membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const membership = yield membershipModel_1.default.findById(membershipId);
                if (!membership) {
                    return { status: false, sessionId: null };
                }
                yield this.incrementMembershipUsers(membershipId, 1);
                const totalCost = membership.cost;
                const now = new Date();
                let endDate;
                if (membership.type === "Monthly") {
                    endDate = new Date(now.setMonth(now.getMonth() + 1));
                }
                else if (membership.type === "Annual") {
                    endDate = new Date(now.setFullYear(now.getFullYear() + 1));
                }
                else {
                    return { status: false, sessionId: null };
                }
                const user = yield userModel_1.default.findByIdAndUpdate(userId, {
                    isPrimeMember: true,
                    primeSubscription: {
                        membershipId,
                        startDate: new Date(),
                        endDate,
                        type: membership.type,
                        status: "active",
                    },
                }, { new: true });
                if (!user) {
                    return { status: false, sessionId: null };
                }
                const { username, email } = user;
                const session = yield (0, stripeMembershipService_1.default)({ username, email }, totalCost);
                return { status: true, sessionId: session.id };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMembershipRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield userModel_1.default.findById(userId);
                if (!user) {
                    return { status: false, existingMembership: null, memberships: null };
                }
                if (user.isPrimeMember && ((_a = user.primeSubscription) === null || _a === void 0 ? void 0 : _a.status) === "active") {
                    const existingMembership = yield membershipModel_1.default.findById(user.primeSubscription.membershipId);
                    if (existingMembership) {
                        return {
                            status: true,
                            existingMembership: existingMembership === null || existingMembership === void 0 ? void 0 : existingMembership.toObject(),
                            memberships: [],
                        };
                    }
                }
                const memberships = yield membershipModel_1.default.find({});
                const membershipList = memberships.map((data) => {
                    return data.toObject();
                });
                return {
                    status: true,
                    memberships: membershipList,
                    existingMembership: null,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    cancelMembershipRepo(userId, membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findByIdAndUpdate(userId, {
                    isPrimeMember: false,
                    primeSubscription: {
                        membershipId: null,
                        startDate: null,
                        endDate: null,
                        type: null,
                        status: "inactive",
                    },
                }, { new: true });
                if (!user) {
                    return { message: constants_1.MESSAGES.DATA_NOT_FOUND, status: false };
                }
                yield this.incrementMembershipUsers(membershipId, -1);
                return { message: "Membership canceled successfully..", status: true };
            }
            catch (error) {
                throw error;
            }
        });
    }
    applyCouponRepo(couponCode, minPurchase, todayDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.findOne({
                    couponCode: { $eq: couponCode },
                    expiryDate: { $gt: todayDate },
                    minPurchase: { $lte: minPurchase },
                    isActive: true,
                });
                if (!coupon) {
                    return {
                        message: "Invalid or expired coupon code.",
                        status: false,
                        coupon: null,
                    };
                }
                return {
                    message: "Applied successfully...",
                    status: true,
                    coupon: coupon.toObject(),
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    incrementMembershipUsers(membershipId, number) {
        return __awaiter(this, void 0, void 0, function* () {
            yield membershipModel_1.default.findByIdAndUpdate(membershipId, {
                $inc: { users: number },
            });
        });
    }
}
exports.userRepositoryImpl = userRepositoryImpl;
