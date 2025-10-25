import mongoose, { Types } from "mongoose";
import { expenseModel } from "../model/expense.model.js";


const getPrevTxn=async(PostId:string):Promise<string>=>{
    const currentTxn= await expenseModel.findOne({_id:new mongoose.Types.ObjectId(PostId)}).sort({createAt:-1}).select("currentTxn -_id").lean<{ CurrentTxn: string }>();
    if(!currentTxn) throw new Error("currentTxn is not avail");
    return currentTxn.CurrentTxn;
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