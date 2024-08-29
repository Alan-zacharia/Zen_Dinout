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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const restaurantSchema = new mongoose_1.default.Schema({
    restaurantName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: String,
    description: String,
    tableRate: {
        type: Number,
        default: 200,
    },
    place_name: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    openingTime: Date,
    closingTime: Date,
    isListed: {
        type: Boolean,
        default: true,
    },
    featuredImage: {
        url: String,
        public_id: String,
    },
    secondaryImages: [
        {
            url: String,
            public_id: String,
        },
    ],
    cuisines: [
        {
            type: String,
        },
    ],
    vegOrNonVegType: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isRejected: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.updatedAt = new Date();
        const hashedPassword = yield bcryptjs_1.default.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    });
});
const restaurantModel = mongoose_1.default.model("Restaurant", restaurantSchema);
exports.default = restaurantModel;
