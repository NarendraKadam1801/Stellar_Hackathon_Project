import AsyncHandler from "../util/asyncHandler.util.js";
import { Response, Request } from "express";
import { ApiError } from "../util/apiError.util.js";
import {
    getBalance,
  sendPaymentToWallet,
  verfiyTransaction,
} from "../services/stellar/transcation.stellar.js";
import { createDonation } from "../dbQueries/donation.Queries.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { getPrivateKey } from "../dbQueries/user.Queries.js";
import { createTransaction, getPrevTxn } from "../dbQueries/expense.Queries.js";
import { uploadOnIpfs } from "../services/ipfs(pinata)/ipfs.services.js";
import { saveContractWithWallet } from "../services/stellar/smartContract.handler.stellar.js";

export interface DonationData {
  TransactionId: string;
  postID: string;
  Amount: number;
}

export interface PayWallet {
  PublicKey: string;
  PostId: string;
  Amount: number;
  Cid: string;
}

const verfiyDonationAndSave = AsyncHandler(
  async (req: Request, res: Response) => {
    const donationData: DonationData = req.body;
    if (!donationData) throw new ApiError(400, "Invalid data");
    const verfiyDonation = await verfiyTransaction(donationData.TransactionId);
    if (!verfiyDonation) throw new ApiError(401, "Invalid Transaction");
    const saveData = createDonation(donationData);
    if (!saveData)
      throw new ApiError(
        500,
        `something went wrong while saving data ${saveData}`
      );
    return res
      .status(200)
      .json(new ApiResponse(200, saveData, "saved trasncation"));
  }
);

const walletPay = AsyncHandler(async (req: Request, res: Response) => {
  const senderWallet: PayWallet = req.body;
  if (!senderWallet) throw new ApiError(400, "Provide wallte address");

  const PrivateKey = await getPrivateKey(senderWallet.PostId);
  const prevTxn = await getPrevTxn(senderWallet.PostId);
  const Pay = await sendPaymentToWallet({
    senderKey: PrivateKey,
    receiverKey: senderWallet.PublicKey,
    amount: senderWallet.Amount,
    meta: {
      cid: senderWallet.Cid||"Pending",
      prevTxn: prevTxn,
    },
  });

  if (!Pay) throw new ApiError(500, "Payment faild");

  const UploadData = await saveContractWithWallet({
    privateKey: PrivateKey,
    reciverKey: senderWallet.PublicKey,
    amount: senderWallet.Amount,
    cid: senderWallet.Cid,
    prevTxn: prevTxn,
    metadata: "optional metadata here",
  });

  const data=await createTransaction(UploadData,senderWallet.PostId);

  return res.status(200).json(new ApiResponse(200,data,"saved and created"));

});

export { verfiyDonationAndSave, walletPay };
