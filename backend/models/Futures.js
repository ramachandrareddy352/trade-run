import mongoose from "mongoose";
import { unique } from "viem/chains";

const FuturesSchema = new mongoose.Schema(
  {
    contractID: {
      type: Number,
      required: true,
      unique: true,
    },
    seller: {
      type: String,
      required: true,
    },
    sellerTransactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    initialPrice: {
      type: Number,
      required: true,
    },
    strikePrice: {
      type: Number,
      required: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Number,
      required: true,
    },
    marginRequirement: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    collateral: {
      type: [String],
      required: true,
    },
    amount: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true } // last update is the claimed time
);

module.exports = mongoose.model("futures", FuturesSchema);
