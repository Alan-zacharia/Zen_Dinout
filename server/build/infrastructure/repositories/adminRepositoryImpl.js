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
exports.adminRepositoryImpl = void 0;
const userModel_1 = __importDefault(require("../database/model.ts/userModel"));
const restaurantModel_1 = __importDefault(require("../database/model.ts/restaurantModel"));
const jwtUtils_1 = require("../utils/jwtUtils");
const auth_1 = require("../../domain/entities/auth");
const constants_1 = require("../../configs/constants");
const couponModel_1 = __importDefault(require("../database/model.ts/couponModel"));
const membershipModel_1 = __importDefault(require("../database/model.ts/membershipModel"));
const EmailService_1 = __importDefault(require("../lib/EmailService"));
class adminRepositoryImpl {
    adminLoginRepo(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = credentials;
            try {
                const admin = yield userModel_1.default.findOne({ email });
                if (!admin || !admin.isAdmin) {
                    return {
                        admin: null,
                        message: constants_1.MESSAGES.ADMIN_DOESNOT_EXIST,
                        token: null,
                        refreshToken: null,
                    };
                }
                const hashedPassword = yield (0, auth_1.hashedPasswordCompare)(password, admin.password);
                if (hashedPassword) {
                    const { generatedAccessToken, generatedRefreshToken } = (0, jwtUtils_1.generateTokens)(admin._id, constants_1.ROLES.ADMIN);
                    const _a = admin.toObject(), { password } = _a, adminData = __rest(_a, ["password"]);
                    return {
                        admin: adminData,
                        message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                        refreshToken: generatedRefreshToken,
                        token: generatedAccessToken,
                    };
                }
                else {
                    return {
                        admin: null,
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
    getUsersListRepo(pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemsPerPage = 6;
            try {
                const users = yield userModel_1.default.find()
                    .select("-password")
                    .skip((pageNumber - 1) * itemsPerPage)
                    .limit(itemsPerPage);
                const totalUsers = yield userModel_1.default.countDocuments();
                const totalPages = Math.ceil(totalUsers / itemsPerPage);
                const sanitizedUsers = users.map((user) => {
                    return user.toObject();
                });
                return {
                    users: sanitizedUsers,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getApproveRestaurantListRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurants = yield restaurantModel_1.default
                    .find({ isApproved: false })
                    .select("-password");
                const restauarntList = restaurants.map((restaurant) => {
                    return restaurant.toObject();
                });
                return {
                    restaurants: restauarntList,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantListRepo(pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalPages = 1;
                const pageSize = 6;
                const skip = (pageNumber - 1) * pageSize;
                const restaurants = yield restaurantModel_1.default
                    .find({ isApproved: true })
                    .skip(skip)
                    .limit(pageSize)
                    .select("-password");
                const restauarntList = restaurants.map((restaurant) => {
                    return restaurant.toObject();
                });
                return {
                    restaurants: restauarntList,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    totalPages,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getApproveRestaurantRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurantDetails = yield restaurantModel_1.default.findById(restaurantId);
                if (!restaurantDetails) {
                    return {
                        restaurant: null,
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                    };
                }
                return {
                    restaurant: restaurantDetails.toObject(),
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    userActionRepo(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isBlocked = action === "false";
                const user = yield userModel_1.default.findByIdAndUpdate(userId, { isBlocked }, { new: true });
                if (!user) {
                    return { user: null, message: constants_1.MESSAGES.RESOURCE_NOT_FOUND };
                }
                return {
                    user: user.toObject(),
                    message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    approveRestaurantRepo(restaurantId, action, rejectReason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (action === "reject") {
                    const restaurant = yield restaurantModel_1.default.findByIdAndDelete(restaurantId);
                    if (!restaurant) {
                        return { success: false, message: constants_1.MESSAGES.RESOURCE_NOT_FOUND };
                    }
                    yield EmailService_1.default.sendRestaurantRejectionEmail(restaurant === null || restaurant === void 0 ? void 0 : restaurant.email, rejectReason);
                    return { success: true, message: constants_1.SUCCESS_MESSAGES.RESTAURANT_REJECT };
                }
                const restaurant = yield restaurantModel_1.default.findByIdAndUpdate(restaurantId, {
                    isApproved: true,
                });
                if (!restaurant) {
                    return { success: false, message: constants_1.MESSAGES.RESOURCE_NOT_FOUND };
                }
                yield EmailService_1.default.sendRestaurantConfrimationEmail(restaurant === null || restaurant === void 0 ? void 0 : restaurant.email);
                return { success: true, message: constants_1.SUCCESS_MESSAGES.APPROVED_SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCouponsRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupons = yield couponModel_1.default.find({});
                const allCoupons = coupons.map((coupon) => {
                    return coupon.toObject();
                });
                return {
                    Coupons: allCoupons,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMembershipRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberships = yield membershipModel_1.default.find({});
                const Memberships = memberships.map((membership) => {
                    return membership.toObject();
                });
                return {
                    Memberships,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCouponRepo(couponDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { couponCode, description, discount, discountPrice, expiryDate, minPurchase, startDate, } = couponDetails;
            try {
                const coupon = new couponModel_1.default({
                    couponCode,
                    description,
                    discount,
                    discountPrice,
                    minPurchase,
                    expiryDate,
                    startDate,
                });
                yield coupon.save();
                return {
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                    status: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMembershipInteractor(membershipData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { planName, benefits, cost, description, discount, expiryDate, type, } = membershipData;
            try {
                const membership = new membershipModel_1.default({
                    planName,
                    description,
                    discount,
                    benefits,
                    expiryDate,
                    type,
                });
                yield membership.save();
                return {
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                    status: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeCouponRepo(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.findByIdAndDelete(couponId);
                if (!coupon) {
                    return { status: false, message: constants_1.MESSAGES.RESOURCE_NOT_FOUND };
                }
                return {
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.REMOVED_SUCCESS,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.adminRepositoryImpl = adminRepositoryImpl;
