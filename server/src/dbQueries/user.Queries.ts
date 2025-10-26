import mongoose from "mongoose";
import { ngoModel } from "../model/user(Ngo).model.js";
import { userSingupData,userLoginData } from "../controler/userNgo.controler.js";

interface userData {
  email?: string;
  Id?: string;
}

const findUser = async (userData: userData) => {
  try {
    if (!userData || (!userData?.email && !userData?.Id))
      throw new Error("Provide email address or Id");
    
    const query = userData.email
      ? { Email: userData.email }
      : { _id: new mongoose.Types.ObjectId(userData.Id) };
    
    const userResult = await ngoModel.find(query);
    // Return empty array if no user found (this is normal for signup checks)
    return userResult || [];
  } catch (error) {
    throw error;
  }
};

const saveDataAndToken = async (userData: userSingupData) => {
  try {
    if (!userData) throw new Error("User data is required");
    
    const Data = await ngoModel.create({
      Email: userData.email,
      NgoName: userData.ngoName,
      RegNumber: userData.regNumber,
      Description: userData.description,
      PublicKey: userData.publicKey,
      PrivateKey: userData.privateKey,
      PhoneNo: userData.phoneNo,
      Password: userData.password,
    });
    if (!Data) throw new Error("something went wrong while saving data");
    const { accessToken, refreshToken } = await Data.generateTokens();
    return {
      success: true,
      accessToken,
      refreshToken,
      userData: {
        Id:Data._id,
        Email: Data.Email,
        NgoName: Data.NgoName,
        PublicKey: Data.PublicKey,
      },
    };
  } catch (error) {
    return error;
  }
};

//The way i am writing code is to save time , but never do such thing
//never write code this way!!
const findUserWithTokenAndPassCheck=async(userData:userLoginData)=>{
    try {
        if(!userData || !userData.email||!userData.password) throw new Error("provide email or password");
        const data=await ngoModel.findOne({Email:userData.email});
        if(!data) throw new Error("User not found with this email");
        const isVaildPassword=await data.isPasswordCorrect(userData.password);
        if(!isVaildPassword) throw new Error("Invalid password");
        const {accessToken,refreshToken}=await data.generateTokens();

        return {
            accessToken,
            refreshToken,
            userData:{
                Id:data._id,
                Email:data.Email,
                NgoName:data.NgoName,
                PublicKey:data.PublicKey,
            }
        }

    } catch (error) {
        return error;
    }
}

const getPrivateKey=async(Id:string):Promise<string>=>{
        if(!Id) throw new Error("Please provide userId");
        const UserData= await ngoModel.findOne({_id:new mongoose.Types.ObjectId(Id)}).select("PrivateKey -_Id").lean<{ PrivateKey: string }>();
        if(!UserData) throw new Error("no privatekey found!!");
        return UserData.PrivateKey;
    
}
export { findUser,saveDataAndToken,findUserWithTokenAndPassCheck,getPrivateKey };
