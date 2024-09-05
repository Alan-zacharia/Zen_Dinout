"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    couponCode: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    minPurchase: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const couponModel = (0, mongoose_1.model)("Coupons", couponSchema);
exports.default = couponModel;
