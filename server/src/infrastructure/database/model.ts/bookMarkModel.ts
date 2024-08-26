import mongoose, { Schema } from "mongoose";

const bookMarkSchema = new Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required : true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required : true
  },
},{timestamps : true});

const bookMarkModel = mongoose.model("RestaurantBookmark", bookMarkSchema);

export default bookMarkModel;
