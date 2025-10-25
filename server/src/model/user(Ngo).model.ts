import mongoose from "mongoose";

const expenseSchame = new mongoose.Schema(
  {
    NgoName: {
      type: String,
      require: true,
      unique:true,
    },
    RegNumber:{
      type: String,
      require: true,
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

export const expenseModel = mongoose.model("expensemodel", expenseSchame);
