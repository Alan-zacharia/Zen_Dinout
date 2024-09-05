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
exports.sellerRepository = void 0;
const restaurantModel_1 = __importDefault(require("../database/model/restaurantModel"));
const restaurantTable_1 = __importDefault(require("../database/model/restaurantTable"));
const constants_1 = require("../../configs/constants");
const auth_1 = require("../../domain/entities/auth");
const jwtUtils_1 = require("../utils/jwtUtils");
const EmailService_1 = __importDefault(require("../lib/EmailService"));
const bookingModel_1 = __importDefault(require("../database/model/bookingModel"));
const restaurantTimeSlot_1 = __importDefault(require("../database/model/restaurantTimeSlot"));
const imageService_1 = require("../../presentation/services/shared/imageService");
const timeConvertionHelper_1 = require("../../application/helpers/timeConvertionHelper");
const menuModel_1 = __importDefault(require("../database/model/menuModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class sellerRepository {
    findExistingUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restauarnt = yield restaurantModel_1.default.findOne({ email });
                return !!restauarnt;
            }
            catch (error) {
                throw new Error("Failed to find user. Please try again later.");
            }
        });
    }
    loginRestaurantRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            try {
                const restaurant = yield restaurantModel_1.default.findOne({ email: email });
                if (!restaurant || !restaurant.isApproved) {
                    return {
                        restaurant: null,
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                        token: null,
                        refreshToken: null,
                    };
                }
                const hashedPassword = yield (0, auth_1.hashedPasswordCompare)(password, restaurant.password);
                if (hashedPassword) {
                    const { generatedAccessToken, generatedRefreshToken } = (0, jwtUtils_1.generateTokens)(restaurant._id.toString(), constants_1.ROLES.SELLER);
                    const _a = restaurant.toObject(), { password } = _a, restaurantWithoutPassword = __rest(_a, ["password"]);
                    return {
                        restaurant: restaurantWithoutPassword,
                        message: constants_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                        token: generatedAccessToken,
                        refreshToken: generatedRefreshToken,
                    };
                }
                else {
                    return {
                        restaurant: null,
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
    registerRestaurantRepo(restaurant) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { restaurantName, email, password, contact } = restaurant;
                const existingRestaurant = yield this.findExistingUser(email);
                if (!existingRestaurant) {
                    return {
                        restaurant: null,
                        message: constants_1.MESSAGES.USER_ALREADY_EXISTS,
                    };
                }
                const newRestuarnt = new restaurantModel_1.default({
                    restaurantName,
                    email,
                    contact,
                    password,
                });
                yield newRestuarnt.save();
                EmailService_1.default.sendRegistrationConfirmationEmail(email);
                return {
                    restaurant: newRestuarnt.toObject(),
                    message: constants_1.SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantDetailInteractor(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield restaurantModel_1.default.findById({ _id });
                console.log(restaurant);
                return { restaurant, message: "" };
            }
            catch (error) {
                console.log("OOps an error occured in get restaurant profile : ", error);
                throw error;
            }
        });
    }
    getReservationListRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservationDetails = yield bookingModel_1.default
                    .find({ restaurantId: restaurantId })
                    .populate("userId", "username email")
                    .populate("restaurantId", "restaurantName")
                    .sort({ createdAt: -1 });
                const reservationDatas = reservationDetails.map((data) => {
                    return data.toObject();
                });
                return {
                    reservationDetails: reservationDatas,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getReservationRepo(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservationDetails = yield bookingModel_1.default
                    .findOne({ bookingId: reservationId })
                    .populate("userId", "username email")
                    .populate("restaurantId", "restaurantName")
                    .populate("table", "tableNumber")
                    .sort({ createdAt: -1 });
                if (!reservationDetails) {
                    return {
                        reservation: null,
                        message: "No reservation found",
                    };
                }
                console.log(reservationDetails);
                return {
                    reservation: reservationDetails,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateReservationRepo(reservationId, bookingStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservation = yield bookingModel_1.default
                    .findOneAndUpdate({ bookingId: reservationId }, { bookingStatus: bookingStatus })
                    .populate("userId", "username email");
                if (!reservation) {
                    return {
                        reservation: null,
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                    };
                }
                return {
                    reservation: reservation.toObject(),
                    message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRestaurantTableRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tables = yield restaurantTable_1.default.find({ restaurantId });
                const tableDatas = tables.map((table) => {
                    return table.toObject();
                });
                return {
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    tables: tableDatas,
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
                const timeSlots = yield restaurantTimeSlot_1.default.find({
                    restaurantId,
                    date,
                });
                const times = timeSlots.map((table) => {
                    return table.toObject();
                });
                return {
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                    timeSlots: times,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createRestaurantTableRepo(restaurantId, tableDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tableImage, tableNumber, tableCapacity, tableLocation } = tableDatas;
            try {
                const newTable = new restaurantTable_1.default({
                    restaurantId,
                    tableCapacity,
                    tableImage,
                    tableNumber,
                    tableLocation,
                });
                yield newTable.save();
                return {
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                    newTable: newTable.toObject(),
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createTimeSlotRepo(restaurantId, newSlotData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date, time } = newSlotData;
            try {
                const slotTime = (0, timeConvertionHelper_1.convertToUTCWithOffset)(time, 5, 30);
                const newSlot = new restaurantTimeSlot_1.default({
                    restaurantId,
                    date,
                    time: slotTime,
                });
                yield newSlot.save();
                console.log(newSlot);
                return {
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                    newSlot: newSlot.toObject(),
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRestaurantTableRepo(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const deleteTable = yield restaurantTable_1.default.findByIdAndDelete(tableId);
                if (!deleteTable) {
                    return {
                        message: constants_1.MESSAGES.RESOURCE_NOT_FOUND,
                        status: false,
                    };
                }
                if ((_a = deleteTable.tableImage) === null || _a === void 0 ? void 0 : _a.public_id) {
                    (0, imageService_1.removeuploadedImage)(deleteTable.tableImage.public_id);
                }
                return {
                    message: constants_1.SUCCESS_MESSAGES.REMOVED_SUCCESS,
                    status: true,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    restaurantProfileUpdateRepo(restaurantId, restaurantDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { restaurantName, contact, description, closingTime, location, openingTime, place_name, tableRate, featuredImage, secondaryImages, address, cuisines, vegOrNonVegType, } = restaurantDetails;
            try {
                const locationObject = JSON.parse(String(location));
                const coordinates = locationObject.coordinates;
                const startTime = (0, timeConvertionHelper_1.convertToUTCWithOffset)(openingTime, 5, 30);
                const endTime = (0, timeConvertionHelper_1.convertToUTCWithOffset)(closingTime, 5, 30);
                const restaurant = yield restaurantModel_1.default.findById(restaurantId);
                if (!restaurant) {
                    return { restaurant: null, message: constants_1.MESSAGES.DATA_NOT_FOUND };
                }
                const updatedSecondaryImages = [
                    ...restaurant.secondaryImages,
                    ...(secondaryImages || []),
                ];
                const updatedRestauarnt = yield restaurantModel_1.default.findByIdAndUpdate(restaurantId, {
                    restaurantName,
                    contact,
                    address,
                    description,
                    location: { type: locationObject.type, coordinates },
                    openingTime: startTime,
                    closingTime: endTime,
                    tableRate,
                    featuredImage,
                    secondaryImages: updatedSecondaryImages,
                    place_name,
                    cuisines: cuisines,
                    vegOrNonVegType,
                }, { upsert: true, new: true });
                return {
                    restaurant: updatedRestauarnt.toObject(),
                    message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRestaurantFeaturedImageRepo(restaurantId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield restaurantModel_1.default.findById(restaurantId);
                if (!restaurant) {
                    return {
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                        status: false,
                    };
                }
                restaurant.featuredImage = undefined;
                yield restaurant.save();
                return { status: true, message: constants_1.SUCCESS_MESSAGES.REMOVED_SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRestaurantSecondaryImagesRepo(restaurantId, imageIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield restaurantModel_1.default.findById(restaurantId);
                if (!restaurant) {
                    return {
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                        status: false,
                    };
                }
                imageIds.forEach((imageId) => {
                    restaurant.secondaryImages.pull({ public_id: imageId });
                });
                yield restaurant.save();
                return { status: true, message: constants_1.SUCCESS_MESSAGES.REMOVED_SUCCESS };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteMenuRepo(restaurantId, imageIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield menuModel_1.default.updateOne({ restaurantId }, { $pull: { items: { public_id: { $in: imageIds } } } });
                if (result.modifiedCount === 0) {
                    return {
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                        status: false,
                    };
                }
                return {
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.REMOVED_SUCCESS,
                };
            }
            catch (error) {
                console.error("Error deleting images:", error);
                throw new Error("Error deleting images");
            }
        });
    }
    updateRestaurantTableIsAvailableRepo(tableId, isAvailable) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const table = yield restaurantTable_1.default.findById(tableId);
                if (!table) {
                    return {
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                        status: false,
                    };
                }
                table.isAvailable = isAvailable;
                yield table.save();
                return { status: true, message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY };
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRestaurantTimeSlotAvailableRepo(timeSlotId, available) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeSlot = yield restaurantTimeSlot_1.default.findById(timeSlotId);
                if (!timeSlot) {
                    return {
                        message: constants_1.MESSAGES.DATA_NOT_FOUND,
                        status: false,
                    };
                }
                console.log(timeSlot);
                timeSlot.isAvailable = available;
                yield timeSlot.save();
                return { status: true, message: constants_1.SUCCESS_MESSAGES.UPDATED_SUCCESSFULLY };
            }
            catch (error) {
                throw error;
            }
        });
    }
    createMenuRepo(restaurantId, uploadedImages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingMenu = yield menuModel_1.default.findOne({ restaurantId });
                if (existingMenu) {
                    existingMenu.items.push(...uploadedImages);
                    const updatedMenu = yield existingMenu.save();
                    const updatedMenuImages = updatedMenu.items.map((item) => ({
                        url: item.url,
                        public_id: item.public_id,
                    }));
                    return {
                        status: true,
                        message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                        menuImages: updatedMenuImages,
                    };
                }
                else {
                    const newMenu = new menuModel_1.default({
                        restaurantId,
                        items: uploadedImages,
                    });
                    const savedMenu = yield newMenu.save();
                    const savedMenuImages = savedMenu.items.map((item) => ({
                        url: item.url,
                        public_id: item.public_id,
                    }));
                    return {
                        status: true,
                        message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                        menuImages: savedMenuImages,
                    };
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMenuRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menu = yield menuModel_1.default.findOne({ restaurantId });
                if (!menu) {
                    return {
                        status: true,
                        message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                        menu: [],
                    };
                }
                return {
                    status: true,
                    message: constants_1.SUCCESS_MESSAGES.RESOURCE_CREATED,
                    menu: menu === null || menu === void 0 ? void 0 : menu.toObject(),
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    getDashBoardRepo(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurantIdObjectId = new mongoose_1.default.Types.ObjectId(restaurantId);
                const bookingsData = yield bookingModel_1.default.aggregate([
                    {
                        $match: {
                            restaurantId: restaurantIdObjectId,
                            paymentStatus: "PAID",
                            bookingStatus: "COMPLETED",
                            createdAt: {
                                $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                            },
                            count: { $sum: 1 },
                            revenue: {
                                $sum: {
                                    $multiply: ["$totalAmount", 0.85],
                                },
                            },
                        },
                    },
                    {
                        $sort: { _id: 1 },
                    },
                ]);
                console.log(bookingsData);
                const salesData = bookingsData.map((data) => data.count);
                const revenueData = bookingsData.map((data) => data.revenue);
                console.log(salesData, revenueData);
                return {
                    salesData,
                    revenueData,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.sellerRepository = sellerRepository;
