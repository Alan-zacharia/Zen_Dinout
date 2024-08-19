import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    address: String,
    description: String,
    TableRate: {
      type: Number,
      default: 200,
    },
    place_name: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    openingTime: String,
    closingTime: String,
    // qrCode: String,

    isListed: {
      type: Boolean,
      default: true,
    },
    featuredImage: String,

    secondaryImages: [
      {
        type: String,
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});
const restaurantModel = mongoose.model("Restaurant", restaurantSchema);
export default restaurantModel;
