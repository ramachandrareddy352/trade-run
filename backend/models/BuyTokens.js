const mongoose = require("mongoose");

const BuyTokensSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    udsc: {
      type: Number,
      default: 0,
    },
    usdt: {
      type: Number,
      default: 0,
    },
    weth: {
      type: Number,
      default: 0,
    },
    wbtc: {
      type: Number,
      default: 0,
    },
    dai: {
      type: Number,
      default: 0,
    },
    link: {
      type: Number,
      default: 0,
    },
    sol: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("buyTokens", BuyTokensSchema);
