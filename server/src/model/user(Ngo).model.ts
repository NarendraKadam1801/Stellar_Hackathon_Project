import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


interface INgo {
  NgoName: string;
  RegNumber: string;
  Description: string;
  Email: string;
  PhoneNo: string;
  Password: string;
  PublicKey: string;
  PrivateKey: string;
  RefreshToken?: string;
}

interface INgoMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateTokens(): Promise<{ accessToken: string; refreshToken: string }>;
}


type INgoDocument = mongoose.Document & INgo & INgoMethods;
type INgoModel = mongoose.Model<INgo, {}, INgoMethods>;

const NgoSchema = new mongoose.Schema<INgo, INgoModel, INgoMethods>(
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
    RefreshToken:{
      type:String,
    },
  },
  { timestamps: true }
);

NgoSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    if (!this.Password) {
      return next(new Error("Password is required"));
    }
    const hashedPassword = await bcrypt.hash(this.Password, 10);
    this.Password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});


NgoSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  if (!password) {
    return false;
  }
  return await bcrypt.compare(password, this.Password);
};

NgoSchema.methods.generateAccessToken = function (): string {
  const secret = process.env.ATS;
  
  if (!secret) {
    throw new Error("Access token secret (ATS) is missing");
  }

  return jwt.sign(
    {
      id: this._id,
      email: this.Email,
      NgoName: this.NgoName,
      walletAddr: this.PublicKey,
    },
    secret as string,
    {
      expiresIn: process.env.ATE || "15m", // Default 15 minutes
    }
  );
};

NgoSchema.methods.generateRefreshToken = function (): string {
  const secret = process.env.RTS;
  
  if (!secret) {
    throw new Error("Refresh token secret (RTS) is missing");
  }

  return jwt.sign(
    {
      id: this._id,
      walletAddr: this.PublicKey,
    },
    secret as string,
    {
      expiresIn: process.env.RTE || "7d", // Default 7 days
    }
  );
};

NgoSchema.methods.generateTokens = async function () {
  const accessToken = await this.generateAccessToken();
  const refreshToken = await this.generateRefreshToken();
  
  // Save refresh token to database
  this.RefreshToken = refreshToken;
  await this.save({ validateBeforeSave: false });
  
  return { accessToken, refreshToken };
};


export const ngoModel = mongoose.model("ngomodel", NgoSchema);
