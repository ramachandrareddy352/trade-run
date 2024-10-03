import mongoose from "mongoose";

const BuyFuturesSchema = new mongoose.Schema(
  {
    contractID: {
      type: Number,
      required: true,
    },
    buyer: {
      type: String,
      required: true,
    },
    buyerTransactionHash: {
      type: String,
      default: "N/A",
    },
    collateral: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // last update is the claimed time
);

BuyFuturesSchema.index({ round: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("buyFutures", BuyFuturesSchema);
