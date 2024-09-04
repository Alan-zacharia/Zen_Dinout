import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    restaurantId: {
      type: String,
      required: true,
    },
    tableImage: {
      url: String,
      public_id: String,
    },
    tableNumber: {
      type: String,
      required: true,
    },
    tableCapacity: {
      type: Number,
      required: true,
    },
    tableLocation: {
      type: String,
      enum: ["In", "Out"],
      default: "In",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const restaurantTableModel = mongoose.model("Table", tableSchema);

export default restaurantTableModel;
