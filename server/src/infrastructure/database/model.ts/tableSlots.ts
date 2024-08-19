import mongoose, { Schema } from "mongoose";

const tableSlotsSchema = new Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
  },
  slotStartTime: {
    type: String,
    required: true,
  },
  slotEndTime: {
    type: String,
    required: true,
  },
  slotDate: {
    type: Date,
    required: true,
  },
  IsAvailable: {
    type: Boolean,
    default: true,
  },
});

const tableSlots = mongoose.model("TableSlots", tableSlotsSchema);

export default tableSlots;
