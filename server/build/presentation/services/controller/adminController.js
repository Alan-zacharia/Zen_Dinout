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
exports.adminController = void 0;
const express_validator_1 = require("express-validator");
const Wintson_1 = __importDefault(require("../../../infrastructure/lib/Wintson"));
const appError_1 = require("../../middlewares/appError");
const constants_1 = require("../../../configs/constants");
const cookieUtils_1 = require("../../../infrastructure/utils/cookieUtils");
class adminController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    adminLoginController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorMessage = errors.array()[0].msg;
                return res
                    .status(constants_1.STATUS_CODES.BAD_REQUEST)
                    .json({ message: errorMessage });
            }
            console.log("admin login service .....");
            const { email, password } = req.body;
            try {
                const { admin, message, token, refreshToken } = yield this.interactor.adminLoginInteractor({ email, password });
                console.log(admin);
                if (!admin) {
                    return res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({ message });
                }
                console.log(refreshToken);
                if (refreshToken)
                    (0, cookieUtils_1.setAuthTokenCookie)(res, "refreshToken", refreshToken);
                return res.status(constants_1.STATUS_CODES.OK).json({ user: admin, message, token });
            }
            catch (error) {
                Wintson_1.default.error(`Error in admin login ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getUserListContoller(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get User service.......");
            const page = parseInt(req.query.page) || 1;
            const pageNumber = isNaN(page) ? 1 : page;
            try {
                const result = yield this.interactor.getUserListInteractor(pageNumber);
                const { message, users, totalPages } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, users, totalPages });
            }
            catch (error) {
                Wintson_1.default.error(`Error in Get users : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getApproveRestaurantListController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get approve restaurants service ....");
            try {
                const result = yield this.interactor.getApproveRestaurantListInteractor();
                const { message, restaurants } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, restaurants });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get approve restaurant service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getRestaurantListController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get restaurant service......");
            const page = parseInt(req.query.page);
            const pageNumber = isNaN(page) ? 1 : page;
            try {
                const result = yield this.interactor.getRestaurantListInteractor(pageNumber);
                const { message, restaurants, totalPages } = result;
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message, restaurants, totalPages });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get restaurant service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getApproveRestaurantController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get approve restauarnt service ....");
            const { restaurantId } = req.params;
            try {
                const result = yield this.interactor.getApproveRestaurantInteractor(restaurantId);
                const { message, restaurant } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, restaurant });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get Approve Restaurant service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    userActionController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("User Action service......");
            const { userId, action } = req.params;
            try {
                const result = yield this.interactor.userActionInteractor(userId, action);
                const { message, user } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, user });
            }
            catch (error) {
                Wintson_1.default.error(`Error in user action service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    approveRestaurantController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Confirm restaurants service......");
            const { restaurantId } = req.params;
            const { logic, rejectReason } = req.body;
            try {
                const result = yield this.interactor.approveRestaurantInteractor(restaurantId, logic, rejectReason);
                const { message, success } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, success });
            }
            catch (error) {
                Wintson_1.default.error(`Error in apporve restaurant service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getCouponController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get coupons controller.....");
            try {
                const result = yield this.interactor.getCouponsInteractor();
                const { Coupons, message } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, Coupons });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get Coupons service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getMembershipController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get memberships controller.....");
            try {
                const result = yield this.interactor.getMembershipInteractor();
                const { Memberships, message } = result;
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message, memberships: Memberships });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get membership service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getDashboardDetailsController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get dashboard controller.....");
            try {
                const result = yield this.interactor.getDashboardDetailsInteractor();
                const { restaurantCount, totalAmount, userCount, status, revenueData, salesData, restaurants, users, } = result;
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({
                    status,
                    restaurantCount,
                    totalAmount,
                    userCount,
                    revenueData,
                    salesData,
                    restaurants,
                    users,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get membership service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    updateMembershipController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { updatedMembership } = req.body;
            console.log("Update memberships controller.....");
            try {
                const result = yield this.interactor.updateMembershipInteractor(updatedMembership);
                const { Membership, message } = result;
                if (!Membership) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message, Membership });
                }
                return res
                    .status(constants_1.STATUS_CODES.CREATED)
                    .json({ message, membership: Membership });
            }
            catch (error) {
                Wintson_1.default.error(`Error in update membership service ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    createCouponController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Create coupon controller.....");
            try {
                const couponDetails = req.body;
                const result = yield this.interactor.createCouponInteractor(couponDetails);
                const { message, status } = result;
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, status: true });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create coupon ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    updateCouponController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("update coupon controller.....");
            const { couponId } = req.params;
            const { formData } = req.body;
            try {
                const result = yield this.interactor.updateCouponInteractor(couponId, formData);
                const { message, status } = result;
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in remove coupon ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    removeCouponController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Remove coupons controller.....");
            const { couponId } = req.params;
            try {
                const result = yield this.interactor.removeCouponInteractor(couponId);
                const { message, status } = result;
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.NO_CONTENT).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in remove coupon ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    removeMembershipController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Remove coupons controller.....");
            const { membershipId } = req.params;
            try {
                const result = yield this.interactor.removeMembershipInteractor(membershipId);
                const { message, status } = result;
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.NO_CONTENT).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in remove coupon ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    createMembershipController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Add Membership controller.....");
            const membershipData = req.body;
            try {
                const result = yield this.interactor.createMembershipInteractor(membershipData);
                const { message, status } = result;
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: message, status });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create membership coupon ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.adminController = adminController;
