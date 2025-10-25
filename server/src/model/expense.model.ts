import mongoose from "mongoose";

const expenseSchame = new mongoose.Schema(
  {
    currentTxn: {
      type: String,
      unique: true,
    },
    previousTxn: {
      type: String,
      unique: true,
    },
    postIDs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    usedAmount: {
      type: Number,
      require: true,
    },
    usedFrom: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "donation",
      },
    ],
    ipfsCid: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const expenseModel = mongoose.model("expensemodel", expenseSchame);
