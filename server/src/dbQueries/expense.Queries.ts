import mongoose, { Types } from "mongoose";
import { expenseModel } from "../model/expense.model.js";


const getPrevTxn=async(PostId:string):Promise<string>=>{
    const currentTxn= await expenseModel.findOne({_id:new mongoose.Types.ObjectId(PostId)}).sort({createdAt:-1}).select("currentTxn -_id").lean<{ currentTxn: string }>();
    if(!currentTxn) throw new Error("No previous transaction found for this post");
    return currentTxn.currentTxn;
}  


interface TransactionData {
  currentTxn: unknown;
  previousTxn?: string;
  postID: string;
  ipfsCid?: string;
}

const createTransaction = async (txnData: unknown, postId:string) => {
  try {
    if (!txnData) throw new Error("Invalid transaction data");
    return await expenseModel.create({
      currentTxn: txnData,
      postIDs:new mongoose.Types.ObjectId(postId),
    });
  } catch (error) {
    return error;
  }
};

export{
    getPrevTxn,
    createTransaction,

}