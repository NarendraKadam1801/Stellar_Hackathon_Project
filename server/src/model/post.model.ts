import mongoose, { Document } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  Title: string;
  Type: string;
  Description: string;
  Location: string;
  ImgCid: string;
  NgoRef: mongoose.Types.ObjectId;
  NeedAmount: number;
  CollectedAmount?: number;
  WalletAddr: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchame = new mongoose.Schema(
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
    },
    NgoRef:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"ngomodel"
    },
    NeedAmount: {
      type: Number,
      require: true,
    },
    CollectedAmount: {
      type: Number,
    },
    WalletAddr: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const postModel = mongoose.model<IPost>("postmodel", postSchame);
