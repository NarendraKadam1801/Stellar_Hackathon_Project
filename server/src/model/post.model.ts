import mongoose from "mongoose";

const expenseSchame = new mongoose.Schema(
  {
    Title: {
      type: String,
      require: true,
    },
    Type: {
      type: String,
      require: true,
    },
    Description: {
      type: String,
      require: true,
    },
    Location: {
      type: String,
      require: true,
    },
    ImgCid: {
      type: String,
      unique: true,
      require: true,
    },
    NeedAmount: {
      type: Number,
      require: true,
    },
    CollectedAmount: {
      type: Number,
      require: true,
    },
    WalletAddr: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const expenseModel = mongoose.model("expensemodel", expenseSchame);
