import { Request, Response } from "express";
import AsyncHandler from "../util/asyncHandler.util.js";
import { ApiError } from "../util/apiError.util.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { getPrevTxn, createTransaction } from "../dbQueries/expense.Queries.js";

export interface GetPrevTxnRequest {
  postId: string;
}

export interface CreateTxnRequest {
  txnData: unknown;
  postId: string;
}

// Get previous transaction for a post
const getPreviousTransaction = AsyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!postId) throw new ApiError(400, "Post ID is required");
  
  const prevTxn = await getPrevTxn(postId);
  if (!prevTxn) throw new ApiError(404, "Previous transaction not found");
  
  return res.status(200).json(new ApiResponse(200, { prevTxn }, "Previous transaction retrieved"));
});

// Create new transaction record
const createTransactionRecord = AsyncHandler(async (req: Request, res: Response) => {
  const { txnData, postId } = req.body as CreateTxnRequest;
  if (!txnData || !postId) throw new ApiError(400, "Transaction data and post ID are required");
  
  const transaction = await createTransaction(txnData, postId);
  if (!transaction) throw new ApiError(500, "Failed to create transaction record");
  
  return res.status(200).json(new ApiResponse(200, transaction, "Transaction record created"));
});

export {
  getPreviousTransaction,
  createTransactionRecord
};
