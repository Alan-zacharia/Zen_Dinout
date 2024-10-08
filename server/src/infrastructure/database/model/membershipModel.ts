import mongoose, { Document, Schema } from "mongoose";

export interface MembershipPlanDocument extends Document {
  planName: string;
  description?: string;
  type: string;
  cost: number;
  benefits: { [key: string]: string[] };
  users: number;
  isActive: Boolean;
  discount: number;
  expiryDate?: Date;
}

const membershipPlanSchema: Schema<MembershipPlanDocument> = new Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Monthly", "Annual"],
    },
    cost: {
      type: Number,
      required: true,
    },
    benefits: [
      {
        type: String,
      },
    ],
    users: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const membershipModel = mongoose.model<MembershipPlanDocument>(
  "MembershipPlan",
  membershipPlanSchema
);

export default membershipModel;
