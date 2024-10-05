const mongoose = require("mongoose");

const UserAirdropSchema = new mongoose.Schema(
  {
    round: {
      type: Number,
      required: true,
    },
    root: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      default: "N/A", // when ever the user claim the aidrop then we store hash
    },
    user: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    proofs: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true } // last update is the claimed time
);

UserAirdropSchema.index({ round: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("userAirdrop", UserAirdropSchema);
