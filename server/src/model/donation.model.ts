import mongoose from "mongoose";

const donationSchame = new mongoose.Schema(
  {
    currentTxn: {
      type: String,
      unique: true,
    },
    postIDs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    Amount: {
      type: Number,
      require: true,
    },
    RemainingAmount: {
      type: Number,
      require: true,
    },
    
  },
  { timestamps: true }
);

export const donationModel = mongoose.model("donationmodel", donationSchame);
