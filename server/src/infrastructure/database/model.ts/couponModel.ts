import { Schema, model, Document, Model } from "mongoose";
import { CouponDetailsInterface } from "../../../domain/entities/admin";

interface CouponDocument extends CouponDetailsInterface, Document {}

const couponSchema = new Schema({
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
    validate: {
      validator: function (this: CouponDocument, value: Date) {
        return value.getTime() > this.startDate.getTime();
      },
      message: "Expiry date must be after start date!",
    },
  },
  isActive : {
    type : Boolean,
    default : true
  }
},{timestamps : true});

const couponModel = model("Coupons", couponSchema);

export default couponModel;
