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
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const envConfig_1 = __importDefault(require("../../configs/envConfig"));
const stripe = new stripe_1.default(envConfig_1.default.STRIPE_SECRET_KEY);
const createPaymentIntent = (userData, totalCost, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(userData);
        const user = yield stripe.customers.create({
            name: userData.name,
            email: userData.email,
        });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer: user.id,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Guests",
                            description: "Table booking",
                        },
                        unit_amount: Math.round(totalCost * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${envConfig_1.default.CLIENT_URL}/payment-status/${bookingId}?success=true`,
            cancel_url: `${envConfig_1.default.CLIENT_URL}/payment-status/${bookingId}?status=false`,
        });
        return session;
    }
    catch (error) {
        throw new Error(`Error creating payment session: ${error.message}`);
    }
});
exports.createPaymentIntent = createPaymentIntent;
