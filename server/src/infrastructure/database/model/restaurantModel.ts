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
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: String,
    description: String,
    tableRate: {
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
    openingTime: Date,
    closingTime: Date,
    isListed: {
      type: Boolean,
      default: true,
    },
    featuredImage: {
      url: String,
      public_id: String,
    },
    secondaryImages: [
      {
        url: String,
        public_id: String,
      },
    ],
    cuisines: [
      {
        type: String,
      },
    ],
    vegOrNonVegType: {
      type: String,
    },
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
