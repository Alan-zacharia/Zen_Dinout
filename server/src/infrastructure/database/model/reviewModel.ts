import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
