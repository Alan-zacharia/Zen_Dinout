import mongoose from "mongoose";
const Schema = mongoose.Schema;

const timeSlotSchema = new Schema(
  {
    restaurantId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isAvailable : {
      type : Boolean,
      default : true
    }
  },
  { timestamps: true }
);

const timeSlotModel = mongoose.model("TimeSlot", timeSlotSchema);

export default timeSlotModel;
