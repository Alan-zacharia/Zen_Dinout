import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
  isBlocked: boolean;
  role: string;
  isVerified: boolean;
  isAdmin: boolean;
  isPrimeMember: boolean;
  primeSubscription: {
    membershipId: string;
    status: "active" | "";
    startDate: Date;
    endDate: Date;
    type: string;
  };
}

const userSchema: Schema<UserDocument> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  isPrimeMember: {
    type: Boolean,
    default: false,
  },
  primeSubscription: {
    membershipId: {
      type: mongoose.Types.ObjectId,
      ref: "MembershipPlan",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre<UserDocument>("save", async function (next) {
  this.updatedAt = new Date();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
