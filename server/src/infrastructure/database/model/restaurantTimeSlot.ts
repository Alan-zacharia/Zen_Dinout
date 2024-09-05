import mongoose, { Schema } from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  date: { type: String, required: true },
  time: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
  isBooked: { type: Boolean, default: false },
});

const TimeSlot = mongoose.model("RestaurantTimeSlot", timeSlotSchema);

export default TimeSlot;
