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
exports.sellerController = void 0;
const Wintson_1 = __importDefault(require("../../../infrastructure/lib/Wintson"));
const constants_1 = require("../../../configs/constants");
const appError_1 = require("../../middlewares/appError");
const ImageUploadHelper_1 = require("../../../infrastructure/helper/ImageUploadHelper");
const dataPreperationHelpers_1 = require("../../../application/helpers/dataPreperationHelpers");
const formParsingHelper_1 = require("../../../application/helpers/formParsingHelper");
const timeConvertionHelper_1 = require("../../../application/helpers/timeConvertionHelper");
const cookieUtils_1 = require("../../../infrastructure/utils/cookieUtils");
class sellerController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    loginRestaurantController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield this.interactor.loginRestaurantInteractor({
                    email,
                    password,
                });
                const { restaurant, message, token, refreshToken } = result;
                if (!restaurant) {
                    return res
                        .status(constants_1.STATUS_CODES.UNAUTHORIZED)
                        .json({ message, token: null });
                }
                if (refreshToken)
                    (0, cookieUtils_1.setAuthTokenCookie)(res, "refreshToken", refreshToken);
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message, restaurant, token, refreshToken });
            }
            catch (error) {
                Wintson_1.default.error(`Error during restaurant login : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    registerRestaurantController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restauarant register service ...........");
            const credentials = req.body;
            try {
                const result = yield this.interactor.registerRestaurantInteractor(credentials);
                const { message, restaurant } = result;
                if (!restaurant) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message });
            }
            catch (error) {
                Wintson_1.default.error(`Error during restaurant register :${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getRestaurantDetailController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurant profile ....");
            const restaurantId = req.userId;
            try {
                const { restaurant } = yield this.interactor.getRestaurantDetailInteractor(restaurantId);
                if (!restaurant) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: "Restaurant not found" });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({
                    restaurantDetails: restaurant,
                    message: constants_1.SUCCESS_MESSAGES.FETCHED_SUCCESSFULLY,
                });
            }
            catch (error) {
                Wintson_1.default.error(`Error in restaurant profile :${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getReservationListController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reservation details .......");
            const restaurantId = req.userId;
            try {
                const { message, reservationDetails } = yield this.interactor.getReservationListInteractor(restaurantId);
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message, Reservations: reservationDetails });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get reservation list :${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getRestaurantTableController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Restaurant tables........");
            const restaurantId = req.userId;
            try {
                const { message, tables } = yield this.interactor.getRestaurantTableInteractor(restaurantId);
                return res.status(constants_1.STATUS_CODES.OK).json({ tables, message });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get tables :${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getTimeSlotController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Time Slots .....");
            const restaurantId = req.userId;
            const date = req.params.date ? req.params.date : new Date().toISOString();
            console.log(date);
            try {
                const { message, timeSlots } = yield this.interactor.getTimeSlotInteractor(restaurantId, date);
                console.log(timeSlots);
                res.json(timeSlots);
            }
            catch (error) {
                Wintson_1.default.error(`Error in get time slot : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    getReservationController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurant user reservation details .......");
            const reservationId = req.params.reservationId;
            try {
                const { reservation, message } = yield this.interactor.getReservationInteractor(reservationId);
                if (!reservation) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message: constants_1.MESSAGES.INVALID_FORMAT, bookingDetails: null });
                }
                return res
                    .status(constants_1.STATUS_CODES.OK)
                    .json({ message, bookingDetails: reservation });
            }
            catch (error) {
                Wintson_1.default.error(`Error in get reservation detail : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    updateReservationStatusController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurant reservation status update .......");
            const { reservationId } = req.params;
            const bookingStatus = req.body.statusData;
            try {
                const { message, reservation } = yield this.interactor.updateReservationInteractor(reservationId, bookingStatus);
                if (!reservation) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ message, bookingDetails: null });
                }
                return res
                    .status(constants_1.STATUS_CODES.CREATED)
                    .json({ message, bookingDetails: reservation });
            }
            catch (error) {
                Wintson_1.default.error(`Error in udpate reservation detail : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    createRestaurantTableController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creating table ....");
            const restaurantId = req.userId;
            try {
                const { fields, files } = yield (0, formParsingHelper_1.parseFormData)(req);
                const datas = Object.assign({}, fields);
                if (files.tableImage) {
                    const imageFile = Array.isArray(files.tableImage)
                        ? files.tableImage[0]
                        : files.tableImage;
                    datas.tableImage = yield (0, ImageUploadHelper_1.handleImageUploads)(imageFile.filepath);
                }
                const tableDatas = yield (0, dataPreperationHelpers_1.prepareFromidableData)(datas);
                console.log(tableDatas);
                const { message, newTable } = yield this.interactor.createRestaurantTableInteractor(restaurantId, tableDatas);
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, newTable });
            }
            catch (error) {
                Wintson_1.default.error(`Error in adding table : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    deleteRestaurantTableController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deleting table ....");
            const tableId = req.params.tableId;
            try {
                const { message, status } = yield this.interactor.deleteRestaurantTableInteractor(tableId);
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.NO_CONTENT).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in deleting table : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    createTimeSlotController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Create table time slot ....");
            const restaurantId = req.userId;
            const { newSlotData } = req.body;
            console.log(req.body);
            const { date, time, maxTables } = newSlotData;
            try {
                const slotTime = (0, timeConvertionHelper_1.convertToUTCWithOffset)(time, 5, 30);
                const { message, newSlot } = yield this.interactor.createTimeSlotInteractor(restaurantId, newSlotData);
                return res.status(constants_1.STATUS_CODES.CREATED).json({ newSlot, message });
            }
            catch (error) {
                Wintson_1.default.error(`Error creating time slot : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    restaurantProfileUpdateController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurant update .......");
            const restaurantId = req.userId;
            try {
                const { fields, files } = yield (0, formParsingHelper_1.parseFormData)(req);
                const datas = Object.assign({}, fields);
                if (files.featuredImage) {
                    const featuredFile = Array.isArray(files.featuredImage)
                        ? files.featuredImage[0]
                        : files.featuredImage;
                    datas.featuredImage = yield (0, ImageUploadHelper_1.handleImageUploads)(featuredFile.filepath);
                }
                if (files.secondaryImages) {
                    const filePaths = Array.isArray(files.secondaryImages)
                        ? files.secondaryImages.map((file) => file.filepath)
                        : [files.secondaryImages.filepath];
                    datas.secondaryImages = yield (0, ImageUploadHelper_1.handleImageUploads)(filePaths);
                }
                const restaurantDetails = yield (0, dataPreperationHelpers_1.prepareFromidableData)(datas);
                const result = yield this.interactor.restaurantProfileUpdateInteractor(restaurantId, restaurantDetails);
                const { message, restaurant } = result;
                if (!restaurant) {
                    return res
                        .status(constants_1.STATUS_CODES.BAD_REQUEST)
                        .json({ message: constants_1.MESSAGES.SOMETHING_WENT_WRONG });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, restaurant });
            }
            catch (error) {
                Wintson_1.default.error(`Error in update profile: ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    deleteRestaurantFeaturedImageController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deleting restaurant image...");
            const restaurantId = req.userId;
            const imageId = req.query.imageId;
            try {
                const result = yield this.interactor.deleteRestaurantFeaturedImageInteractor(restaurantId, imageId);
                const { message, status } = result;
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in deleting image : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    deleteRestaurantSecondaryImagesController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Deleting restaurant images...");
            const imageIds = Array.isArray(req.query.ids)
                ? req.query.ids
                : [req.query.ids];
            const restaurantId = req.userId;
            try {
                const result = yield this.interactor.deleteRestaurantSecondaryImagesInteractor(restaurantId, imageIds);
                const { message, status } = result;
                if (!status) {
                    return res
                        .status(constants_1.STATUS_CODES.NOT_FOUND)
                        .json({ status, message: constants_1.MESSAGES.SOMETHING_WENT_WRONG });
                }
                return res.status(constants_1.STATUS_CODES.OK).json({ status, message });
            }
            catch (error) {
                Wintson_1.default.error(`Error in deleting images: ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    updateRestaurantTableIsAvailableController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Restaurant Table update isAvailable .......");
            const { tableId } = req.params;
            const isAvailable = req.body.isAvailable;
            try {
                console.log(tableId, isAvailable);
                const { message, status } = yield this.interactor.updateRestaurantTableIsAvailableInteractor(tableId, isAvailable);
                if (!status) {
                    return res.status(constants_1.STATUS_CODES.NOT_FOUND).json({ message, status });
                }
                return res.status(constants_1.STATUS_CODES.CREATED).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error in update table avaialbility : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
    updateRestaurantTimeSlotAvailableController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Update time slot availability......");
            const { timeSlotId } = req.params;
            const isAvailable = req.query.available;
            const available = isAvailable == "true";
            console.log(isAvailable, available);
            try {
                const result = yield this.interactor.updateRestaurantTimeSlotAvailableInteractor(timeSlotId, available);
                const { message, status } = result;
                return res.status(constants_1.STATUS_CODES.OK).json({ message, status });
            }
            catch (error) {
                Wintson_1.default.error(`Error update time slot : ${error.message}`);
                next(new appError_1.AppError(error.message, constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.sellerController = sellerController;
