import mongoose, { Schema } from "mongoose";
import TimeSlot from "./restaurantTimeSlot";
const ObjectId = Schema.Types.ObjectId;

const bookingSchema = new Schema({
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
  bookingStatus: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "CHECKED"],
    default: "PENDING",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

const bookingModel = mongoose.model("bookings", bookingSchema);
export default bookingModel;
