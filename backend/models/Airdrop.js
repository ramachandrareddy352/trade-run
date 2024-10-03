const mongoose = require("mongoose");

const AirdropSchema = new mongoose.Schema(
  {
    round: {
      type: Number,
      required: true,
      unique: true,
    },
    root: {
      type: String,
      required: true,
      unique: true,
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    totalTokens: {
      type: Number,
      required: true,
    },
    claimedTokens: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("airdrop", AirdropSchema);
