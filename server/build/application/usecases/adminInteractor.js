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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminInteractorImpl = void 0;
const constants_1 = require("../../configs/constants");
class adminInteractorImpl {
    constructor(repository) {
        this.repository = repository;
    }
    adminLoginInteractor(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = credentials;
            if (!password || !email) {
                return {
                    message: constants_1.MESSAGES.INVALID_DATA,
                    admin: null,
                    refreshToken: null,
                    token: null,
                };
            }
            try {
                const result = yield this.repository.adminLoginRepo(credentials);
                const { admin, message, refreshToken, token } = result;
                return { admin, message, token, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserListInteractor(pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getUsersListRepo(pageNumber);
                const { message, users, totalPages } = result;
                return { users, message, totalPages };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDashboardDetailsInteractor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getDashboardDetailsRepo();
                const { restaurantCount, totalAmount, userCount, status, revenueData, salesData, restaurants, users, } = result;
                return {
                    restaurantCount,
                    totalAmount,
                    userCount,
                    status,
                    revenueData,
                    salesData,
                    restaurants,
                    users,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getApproveRestaurantListInteractor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getApproveRestaurantListRepo();
                const { message, restaurants } = result;
                return { restaurants, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantListInteractor(pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getRestaurantListRepo(pageNumber);
                const { message, restaurants, totalPages } = result;
                return { restaurants, message, totalPages };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getApproveRestaurantInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { restaurant: null, message: constants_1.MESSAGES.INVALID_FORMAT };
            }
            try {
                const result = yield this.repository.getApproveRestaurantRepo(restaurantId);
                const { message, restaurant } = result;
                return { restaurant, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    userActionInteractor(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !action) {
                return { user: null, message: constants_1.MESSAGES.INVALID_FORMAT };
            }
            try {
                const result = yield this.repository.userActionRepo(userId, action);
                const { message, user } = result;
                return { user, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    approveRestaurantInteractor(restaurantId, logic, rejectReason) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { success: false, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const result = yield this.repository.approveRestaurantRepo(restaurantId, logic, rejectReason);
                const { message, success } = result;
                return { message, success };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCouponsInteractor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getCouponsRepo();
                const { message, Coupons } = result;
                return { message, Coupons };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMembershipInteractor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getMembershipRepo();
                const { message, Memberships } = result;
                return { message, Memberships };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCouponInteractor(couponDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { couponCode, description, discount, discountPrice, minPurchase, startDate, expiryDate, } = couponDetails;
            if (!couponCode ||
                !description ||
                !discount ||
                !discountPrice ||
                !minPurchase ||
                !startDate ||
                !expiryDate) {
                return { message: constants_1.MESSAGES.INVALID_DATA, status: false };
            }
            try {
                const result = yield this.repository.createCouponRepo(couponDetails);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMembershipInteractor(memebershipData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { planName, benefits, cost, type, description, discount, expiryDate, } = memebershipData;
            if (!planName ||
                !benefits ||
                !cost ||
                !type ||
                !description ||
                !discount ||
                !expiryDate) {
                return { message: constants_1.MESSAGES.INVALID_DATA, status: false };
            }
            try {
                const result = yield this.repository.createMembershipRepo(memebershipData);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateMembershipInteractor(updatedMembership) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!updatedMembership ||
                !updatedMembership.cost ||
                !updatedMembership.planName) {
                return { message: constants_1.MESSAGES.INVALID_DATA, Membership: null };
            }
            try {
                const result = yield this.repository.updateMembershipRepo(updatedMembership);
                const { message, Membership } = result;
                return { message, Membership };
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeMembershipInteractor(membershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!membershipId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const result = yield this.repository.removeMembershipRepo(membershipId);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCouponInteractor(couponId, couponDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!couponId || !couponDatas || !couponDatas.couponCode) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const result = yield this.repository.updateCouponRepo(couponId, couponDatas);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeCouponInteractor(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!couponId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const result = yield this.repository.removeCouponRepo(couponId);
                const { message, status } = result;
                return { message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.adminInteractorImpl = adminInteractorImpl;
