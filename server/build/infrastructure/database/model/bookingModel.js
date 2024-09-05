"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ObjectId = mongoose_1.Schema.Types.ObjectId;
const bookingSchema = new mongoose_1.Schema({
    bookingId: {
        type: String,
        require: true,
        unique: true,
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    table: {
        type: ObjectId,
        ref: "Table",
        required: true,
        index: true,
    },
    restaurantId: {
        type: ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
    },
    timeSlot: {
        type: ObjectId,
        ref: "RestaurantTimeSlot",
        required: true,
        index: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    bookingTime: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["Online", "Wallet"],
    },
    paymentStatus: {
        type: String,
        enum: ["PAID", "PENDING", "FAILED", "REFUNDED"],
        default: "PENDING",
    },
    guestCount: {
        type: Number,
        required: true,
    },
    bookingStatus: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "CHECKED"],
        default: "PENDING",
    },
    subTotal: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const bookingModel = mongoose_1.default.model("bookings", bookingSchema);
exports.default = bookingModel;
