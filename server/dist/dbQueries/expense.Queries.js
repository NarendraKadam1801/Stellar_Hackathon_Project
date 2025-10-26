import mongoose from "mongoose";
import { expenseModel } from "../model/expense.model.js";
const getPrevTxn = async (PostId) => {
    const currentTxn = await expenseModel.findOne({ _id: new mongoose.Types.ObjectId(PostId) }).sort({ createAt: -1 }).select("currentTxn -_id").lean();
    if (!currentTxn)
        throw new Error("currentTxn is not avail");
    return currentTxn.CurrentTxn;
};
const createTransaction = async (txnData, postId) => {
    try {
        if (!txnData)
            throw new Error("Invalid transaction data");
        return await expenseModel.create({
            currentTxn: txnData,
            postIDs: new mongoose.Types.ObjectId(postId),
        });
    }
    catch (error) {
        return error;
    }
};
export { getPrevTxn, createTransaction, };
//# sourceMappingURL=expense.Queries.js.map