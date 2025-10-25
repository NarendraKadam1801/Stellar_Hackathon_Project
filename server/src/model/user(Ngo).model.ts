import mongoose from "mongoose";

const NgoSchame = new mongoose.Schema(
  {
    NgoName: {
      type: String,
      require: true,
      unique:true,
    },
    RegNumber:{
      type: String,
      require: true,
      unique:true,
    },
    Description: {
      type: String,
      require: true,
    },
    Email: {
      type: String,
      require: true,
      unique:true
    },
     PhoneNo:{
      type: String,
      require: true,
    },
    Password: {
      type: String,
      require: true,
    },
    PublicKey:{
        type:String,
        require:true,
    },
    PrivateKey:{
        type:String,
        require:true,
    },
  },
  { timestamps: true }
);

export const expenseModel = mongoose.model("ngomodel", NgoSchame);
