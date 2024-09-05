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
exports.userController = void 0;
const Wintson_1 = __importDefault(require("../../../infrastructure/lib/Wintson"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = require("../../middlewares/appError");
const constants_1 = require("../../../configs/constants");
const cookieUtils_1 = require("../../../infrastructure/utils/cookieUtils");
const stripePaymentservice_1 = require("../../../infrastructure/payment/stripePaymentservice");
class userController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    registerUserController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("User register service..........");
            const credentials = req.body;
            try {
                const result = yield this.interactor.registerUserInteractor(credentials);
                const { message, user } = result;
                if (!user) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message });
            }
            catch (error) {
                Wintson_1.default.error(`Error in user register service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    loginUserController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("User Login Service..........");
            const { email, password } = req.body;
            try {
                const { user, token, refreshToken, message } = yield this.interactor.loginUserInteractor({ email, password });
                if (!user) {
                    return res
                        .status(constants_1.STATUS_CODES.UNAUTHORIZED)
                        .json({ user: null, message, token: null });
                }
                if (refreshToken)
                    (0, cookieUtils_1.setAuthTokenCookie)(res, "refreshToken", refreshToken);
                return res.status(constants_1.STATUS_CODES.OK).json({ message, user, token });
            }
            catch (error) {
                Wintson_1.default.error(`Error in google login service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    googleLoginController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Google login user........");
            const credentials = req.body;
            try {
                const { user, message, refreshToken, token } = yield this.interactor.googleLoginInteractor(credentials);
                if (!user) {
                    return res
                        .status(constants_1.STATUS_CODES.UNAUTHORIZED)
                        .json({ user: null, message, token: null });
                }
                if (refreshToken)
                    (0, cookieUtils_1.setAuthTokenCookie)(res, "refreshToken", refreshToken);
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, user, token });
            }
            catch (error) {
                Wintson_1.default.error(`Error in google login service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    generateOtpController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Generate otp service............");
            const { email } = req.body;
            try {
                const { message, otp } = yield this.interactor.generateOtpInteractor(email);
                if (!otp) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ otp: otp, message });
            }
            catch (error) {
                Wintson_1.default.error(`Error in generate otp service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    resetPasswordController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reset password service.........");
            const { email } = req.body;
            try {
                const { message, success } = yield this.interactor.resetPasswordRequestInteractor(email);
                if (!success)
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({ message, success });
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message: "Reset Link sent to your email", success });
            }
            catch (error) {
                Wintson_1.default.error(`Error in reset password request service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getProfileController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("User Profile service........");
            const userId = req.userId;
            try {
                const { userDetails, status } = yield this.interactor.getProfileInteractor(userId);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.RESOURCE_NOT_FOUND, userData: null });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    userData: userDetails,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get profile service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getListedRestuarantsController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Restaurants service.....");
            try {
                const { listedRestaurants } = yield this.interactor.getListedRestuarantInteractor();
                return res.status(constants_1.STATUS_CODES.OK).json({
                    restaurant: listedRestaurants,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get restaurants service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getRestauarantDetailedViewController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurants service.....");
            const { restaurantId } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
                return res
                    .status(constants_1.STATUS_CODES.BAD_REQUEST)
                    .json({ message: constants_1.MESSAGES.INVALID_FORMAT });
            }
            try {
                const { restaurant, status, restaurantImages } = yield this.interactor.getRestaurantDetailedViewInteractor(restaurantId);
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                        restaurant: null,
                        restaurantImages: null,
                    });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    restaurant,
                    restaurantImages,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get restaurant detailed service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getBookingDataController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Booking service.....");
            const userId = req.userId;
            try {
                const { bookingData, status } = yield this.interactor.getBookingDataInteractor(userId);
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                        status,
                        bookingData: null,
                    });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    status,
                    bookingData,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get booking details service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getBookingDetailedController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Booking service.....");
            const { bookingId } = req.params;
            try {
                const { bookingData, status } = yield this.interactor.getBookingDetailedInteractor(bookingId);
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                        status,
                        bookingData: null,
                    });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    status,
                    bookingData,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get booking detailed view service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    resetPasswordUpdateController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reset Password Updation service......");
            const { credentials } = req.body;
            const { userId } = req.params;
            try {
                const { message, status } = yield this.interactor.resetPasswordUpdateInteractor(userId, credentials.password);
                if (!status)
                    return res.status(422).json({ message, status });
                return res.status(201).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in update password service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    updateProfileController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Update user details service......");
            const { credentials } = req.body;
            const userId = req.userId;
            try {
                const { updatedUser, status } = yield this.interactor.updateUserProfileInteractor(userId, credentials);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.RESOURCE_NOT_FOUND, status, updatedUser });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({
                    message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
                    userData: updatedUser,
                    status,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in update profile service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    cancelBookingController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Cancel booking service.....");
            const bookingId = req.params.bookingId;
            const userId = req.userId;
            try {
                const { bookingData, status } = yield this.interactor.cancelBookingInteractor(bookingId);
                if (!bookingData) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: constants_1.MESSAGES.INVALID_DATA, status });
                }
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message: "Booking Cancelled...." });
            }
            catch (error) {
                Wintson_1.default.error(`Error in cancel Booking service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getUserWalletController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            try {
                const { status, wallet } = yield this.interactor.getUserWalletInteractor(userId);
                if (!wallet) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.DATA_NOT_FOUND });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    wallet,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get wallet service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getCouponsController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            try {
                const { coupons, status } = yield this.interactor.getCouponsInteractor(today);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: "No coupons available..." });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    coupons,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get coupons service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getSavedRestaurantContoller(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            try {
                const { savedRestaurants, status } = yield this.interactor.getSavedRestaurantInteractor(userId);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.INVALID_FORMAT });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    savedRestaurants,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get saved restaurants service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getCheckSavedRestaurantController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Check saved restaurant......");
            const { restaurantId } = req.params;
            const userId = req.userId;
            try {
                const { isBookmark, status } = yield this.interactor.getCheckSavedRestaurantInteractor(restaurantId, userId);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.INVALID_FORMAT });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    isBookmark,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get saved restaurant service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    saveRestaurantController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { restaurantId } = req.body;
            const userId = req.userId;
            try {
                const { message, status } = yield this.interactor.saveRestaurantInteractor(restaurantId, userId);
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  save restaurant service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    addReviewController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            Wintson_1.default.info("Create Review.....");
            const reviewDatas = req.body;
            const userId = req.userId;
            try {
                const { message, status } = yield this.interactor.addReviewInteractor(reviewDatas, userId);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: message, status });
                }
                return res
                    .status(constants_1.STATUS_CODES.CREATED)
                    .json({ message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  add review service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getReviewsController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Reviews service.....");
            const { restaurantId } = req.params;
            try {
                const { reviews, message, status } = yield this.interactor.getReviewsInteractor(restaurantId);
                return res.status(constants_1.STATUS_CODES.OK).json({ reviews, message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  get reviews service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getMenuController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Menu service.....");
            const { restaurantId } = req.params;
            try {
                const { menu, message, status } = yield this.interactor.getMenuInteractor(restaurantId);
                return res.status(constants_1.STATUS_CODES.OK).json({ menu, message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  get reviews service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getReviewController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Review service.....");
            const { restaurantId } = req.params;
            const userId = req.userId;
            try {
                const { review, message, status } = yield this.interactor.getReviewInteractor(restaurantId, userId);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.DATA_NOT_FOUND });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ review, message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  get reviews service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getRestaurantTablesController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurantId = req.params.restaurantId;
            const tableSize = parseInt(req.query.size) || 1;
            const page = parseInt(req.query.page) || 1;
            const slot = req.query.slot;
            const selectedDate = req.query.date;
            try {
                const { availableTables, status, message, totalTables, tablesPerPage } = yield this.interactor.getRestaurantTableInteractor(restaurantId, tableSize, slot, selectedDate, page);
                if (!status) {
                    return {
                        apiStatus: status,
                        availableTables,
                        message,
                        totalTables,
                        tablesPerPage,
                    };
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    apiStatus: status,
                    availableTables: availableTables,
                    message,
                    totalTables,
                    tablesPerPage,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  get tables service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    createBookingController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creat payment.......");
            const { email, name, restaurantDatas } = req.body;
            const bookingComfirmationDatas = req.body;
            const userId = req.userId;
            const totalCost = restaurantDatas.price;
            try {
                const { status, bookingId, bookingUsingWallet } = yield this.interactor.createBookingInteractor(userId, bookingComfirmationDatas, totalCost);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: constants_1.MESSAGES.INVALID_FORMAT });
                }
                if (bookingUsingWallet) {
                    return res.status(constants_1.STATUS_CODES.CREATED).json({
                        bookingId: bookingId,
                        message: "Booking confirmed....",
                        status: true,
                    });
                }
                if (bookingId) {
                    const session = yield (0, stripePaymentservice_1.createPaymentIntent)({ name, email }, totalCost, bookingId);
                    return res.status(constants_1.STATUS_CODES.CREATED).json({ sessionId: session.id });
                }
                return res
                    .status(constants_1.STATUS_CODES.BAD_REQUEST)
                    .json({ message: constants_1.MESSAGES.INVALID_DATA, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in  create booking service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getTimeSlotController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get time slots...");
            const { date, restaurantId } = req.body;
            try {
                const { TimeSlots, status } = yield this.interactor.getTimeSlotInteractor(restaurantId, date);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: constants_1.MESSAGES.INVALID_FORMAT });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ TimeSlots });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get time slot service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    createMemberShipPaymentController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Create membership payment.....");
            const { membershipId } = req.body;
            const userId = req.userId;
            try {
                const result = yield this.interactor.createMembershipPaymentInteractor(userId, membershipId);
                const { sessionId, status } = result;
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: constants_1.MESSAGES.INVALID_FORMAT });
                }
                return res.status(200).json({ sessionId: sessionId });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create membership service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getMembershipController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            try {
                const { existingMembership, memberships, status } = yield this.interactor.getMembershipInteractor(userId);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ status, message: constants_1.MESSAGES.INVALID_FORMAT });
                }
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ existingMembership, memberships, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get membership service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    cancelMembershipController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Cancel membership.......");
            const membershipId = req.params.membershipId;
            const userId = req.userId;
            try {
                const result = yield this.interactor.cancelMembershipIntearctor(userId, membershipId);
                const { message, status } = result;
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ message });
            }
            catch (error) {
                Wintson_1.default.error(`Error in cancel membership service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    applyCouponController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Apply coupon.......");
            const { couponCode, minPurchase } = req.body;
            const today = new Date();
            try {
                const result = yield this.interactor.applyCouponInteractor(couponCode, minPurchase, today);
                const { coupon, message, status } = result;
                if (!coupon) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ success: status, message });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    success: true,
                    discount: coupon.discount,
                    discountPrice: coupon.discountPrice,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in apply coupon service: ${error.message} `);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    bookingStatusUpdationController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurants bookingStatusUpdation service.....");
            const bookingId = req.params.bookingId;
            const paymentStatus = req.body.paymentStatus;
            try {
                const { status } = yield this.interactor.bookingStatusUpdationInteractor(bookingId, paymentStatus);
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.OK)
                        .json({ message: "Failed to book the table" });
                }
                console.log(bookingId, paymentStatus);
                return res
                    .status(constants_1.STATUS_CODES.CREATED)
                    .json({ message: "Booking Succesfull" });
            }
            catch (error) {
                Wintson_1.default.error(`Error in update booking status : ${error.message}`);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    logoutController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Refresh token removed.......");
            try {
                res.clearCookie("refreshToken");
                return res.status(constants_1.STATUS_CODES.OK).send("Logout successfull...!");
            }
            catch (error) {
                Wintson_1.default.error(`Error in Logout : ${error.message}`);
                next(new appError_1.AppError(constants_1.MESSAGES.INTERNAL_SERVER_ERROR, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.userController = userController;
