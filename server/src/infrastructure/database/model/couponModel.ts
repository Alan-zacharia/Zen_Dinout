import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const couponModel = model("Coupons", couponSchema);

export default couponModel;
