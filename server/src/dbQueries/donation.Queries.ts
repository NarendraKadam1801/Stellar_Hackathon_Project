import { Types } from "mongoose";
import { donationModel } from "../model/donation.model.js";
import { DonationData } from "../controler/payment.controler.js";

const getDonation=async (transactionId:string)=>{
    try {
       return await donationModel.findOne({currentTxn:transactionId});
    } catch (error) {
        return error;
    }
}

const getAllDonation=async ()=>{
    try {
        return await donationModel.find();
    } catch (error) {
        return error;
    }
}


const getDonationRelatedToPost=async(postId:Types.ObjectId)=>{
    try {
        return await donationModel.find({postIDs:postId});
    } catch (error) {
        return error;
    }
}

const createDonation=async(donationData:DonationData)=>{
    try {
        if(!donationData) throw new Error("invalid data")
        return await donationModel.create({
            currentTxn:donationData.TransactionId,
            postIDs:donationData.postID,
            Amount:donationData.Amount,
        });
    } catch (error) {
        return error;
    }
}


export{
    getDonation,
    getAllDonation,
    getDonationRelatedToPost,
    createDonation
}