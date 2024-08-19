import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["credit", "debit"] },
  description: String,
});

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema],
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
