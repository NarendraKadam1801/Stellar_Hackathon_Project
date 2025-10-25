import { Types } from "mongoose";
import AsyncHandler from "../util/asyncHandler.util.js";
import { Response,Request } from "express";
import { ApiError } from "../util/apiError.util.js";
import { verfiyTransaction } from "../services/stellar/transcation.stellar.js";
import { createDonation } from "../dbQueries/donation.Queries.js";
import { ApiResponse } from "../util/apiResponse.util.js";

export interface DonationData{
    TransactionId:string,
    postID:Types.ObjectId,
    Amount:Number,
}

export interface Pay

const verfiyDonationAndSave=AsyncHandler(async(req:Request,res:Response)=>{
    const donationData:DonationData=req.body;
    if(!donationData) throw new ApiError(400,"Invalid data");
    const verfiyDonation=await verfiyTransaction(donationData.TransactionId);
    if(!verfiyDonation) throw new ApiError(401,"Invalid Transaction");
    const saveData=createDonation(donationData);
    if(!saveData) throw new ApiError(500,`something went wrong while saving data ${saveData}`);
    return res.status(200).json(new ApiResponse(200,saveData,"saved trasncation"));
});

const walletPay=AsyncHandler(async(req:Request,res:Response)=>{

});    
export{
    verfiyDonationAndSave,
    walletPay
}