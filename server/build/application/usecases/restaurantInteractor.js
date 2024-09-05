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
exports.sellerInteractor = void 0;
const constants_1 = require("../../configs/constants");
const imageService_1 = require("../../presentation/services/shared/imageService");
class sellerInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    loginRestaurantInteractor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            if (!email || !password) {
                return {
                    restaurant: null,
                    message: constants_1.MESSAGES.INVALID_DATA,
                    token: null,
                    refreshToken: null,
                };
            }
            try {
                const { message, restaurant, token, refreshToken } = yield this.repository.loginRestaurantRepo(data);
                return { message, restaurant, token, refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    registerRestaurantInteractor(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, restaurantName, contact, password } = credentials;
            if (!email || !restaurantName || !contact || !password) {
                return { restaurant: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const result = yield this.repository.registerRestaurantRepo(credentials);
                const { message, restaurant } = result;
                return { message, restaurant };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantDetailInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { restaurant: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const result = yield this.repository.getRestaurantDetailInteractor(restaurantId);
                const { restaurant, message } = result;
                return { restaurant, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReservationListInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { reservationDetails: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, reservationDetails } = yield this.repository.getReservationListRepo(restaurantId);
                return { reservationDetails, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReservationInteractor(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservationId) {
                return { reservation: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, reservation } = yield this.repository.getReservationRepo(reservationId);
                return { reservation, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateReservationInteractor(reservationId, bookingStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservationId) {
                return { reservation: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, reservation } = yield this.repository.updateReservationRepo(reservationId, bookingStatus);
                return { reservation, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantTableInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { tables: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, tables } = yield this.repository.getRestaurantTableRepo(restaurantId);
                return { tables, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTimeSlotInteractor(restaurantId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !date) {
                return { timeSlots: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, timeSlots } = yield this.repository.getTimeSlotRepo(restaurantId, date);
                return { timeSlots, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createRestaurantTableInteractor(restaurantId, tableDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tableImage, tableNumber, tableLocation } = tableDatas;
            if (!restaurantId || !tableImage || !tableNumber || !tableLocation) {
                return { newTable: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, newTable } = yield this.repository.createRestaurantTableRepo(restaurantId, tableDatas);
                return { newTable, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createTimeSlotInteractor(restaurantId, newSlotData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { time, date } = newSlotData;
            if (!restaurantId || !date || !time) {
                return { newSlot: null, message: constants_1.MESSAGES.INVALID_DATA };
            }
            try {
                const { message, newSlot } = yield this.repository.createTimeSlotRepo(restaurantId, newSlotData);
                return { newSlot, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRestaurantTableInteractor(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tableId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const { message, status } = yield this.repository.deleteRestaurantTableRepo(tableId);
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    restaurantProfileUpdateInteractor(restaurantId, restaurantDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, restaurant: null };
            }
            try {
                const result = yield this.repository.restaurantProfileUpdateRepo(restaurantId, restaurantDatas);
                const { message, restaurant } = result;
                return { restaurant, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRestaurantFeaturedImageInteractor(restaurantId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !imageId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const response = yield (0, imageService_1.removeuploadedImage)(imageId);
                console.log(response, imageId);
                if (!response.success) {
                    return { status: false, message: "Failed to remove image.." };
                }
                const result = yield this.repository.deleteRestaurantFeaturedImageRepo(restaurantId, imageId);
                const { message, status } = result;
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRestaurantSecondaryImagesInteractor(restaurantId, imageIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !imageIds) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                for (let imageId of imageIds) {
                    const response = yield (0, imageService_1.removeuploadedImage)(imageId);
                    if (!response.success) {
                        return { status: false, message: "Failed to remove image.." };
                    }
                }
                const result = yield this.repository.deleteRestaurantSecondaryImagesRepo(restaurantId, imageIds);
                const { message, status } = result;
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMenuInteractor(restaurantId, imageIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !imageIds) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                for (let imageId of imageIds) {
                    const response = yield (0, imageService_1.removeuploadedImage)(imageId);
                    if (!response.success) {
                        return { status: false, message: "Failed to remove image.." };
                    }
                }
                const result = yield this.repository.deleteMenuRepo(restaurantId, imageIds);
                const { message, status } = result;
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRestaurantTableIsAvailableInteractor(tableId, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tableId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const result = yield this.repository.updateRestaurantTableIsAvailableRepo(tableId, isAvailable);
                const { message, status } = result;
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRestaurantTimeSlotAvailableInteractor(timeSlotId, avaialable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!timeSlotId) {
                return { message: constants_1.MESSAGES.INVALID_FORMAT, status: false };
            }
            try {
                const result = yield this.repository.updateRestaurantTimeSlotAvailableRepo(timeSlotId, avaialable);
                const { message, status } = result;
                return { status, message };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMenuInteractor(restaurantId, uploadedImages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId || !uploadedImages) {
                return {
                    message: constants_1.MESSAGES.INVALID_DATA,
                    status: false,
                    menuImages: null,
                };
            }
            try {
                const result = yield this.repository.createMenuRepo(restaurantId, uploadedImages);
                const { menuImages, message, status } = result;
                return { menuImages, message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDashBoardInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return { revenueData: [], salesData: [] };
            }
            try {
                const result = yield this.repository.getDashBoardRepo(restaurantId);
                const { revenueData, salesData } = result;
                return { revenueData, salesData };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMenuInteractor(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!restaurantId) {
                return {
                    message: constants_1.MESSAGES.INVALID_DATA,
                    status: false,
                    menu: null,
                };
            }
            try {
                const result = yield this.repository.getMenuRepo(restaurantId);
                const { menu, message, status } = result;
                return { menu, message, status };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.sellerInteractor = sellerInteractor;
