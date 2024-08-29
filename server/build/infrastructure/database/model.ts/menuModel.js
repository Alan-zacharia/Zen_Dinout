"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const menuItemSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ['Starter', 'Main Course', 'Dessert', 'Beverage'],
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const menuSchema = new mongoose_1.default.Schema({
    restaurantId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    items: [menuItemSchema],
});
const menuModel = mongoose_1.default.model('Menu', menuSchema);
exports.default = menuModel;
