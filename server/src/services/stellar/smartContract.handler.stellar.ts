import {
  TransactionBuilder,
  Keypair,
  nativeToScVal,
  BASE_FEE,
  Contract,
  Networks,
  xdr,
} from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/lib/rpc";

interface UserDataWallet {
  privateKey: string;
  reciverKey: string;
  amount: Number;
  cid: string;
  prevTxn: string;
  metadata?: string;
}

const sorobanServer = new Server(process.env.SOROBAN_RPC_URL as string);

export const saveContractWithWallet = async (userData: UserDataWallet) => {
  try {
    const contract = new Contract(process.env.CONTRACTIDF as string);
    const sourceKeyPair = Keypair.fromSecret(userData.privateKey);
    const accountId = sourceKeyPair.publicKey();
    const account = await sorobanServer.getAccount(accountId);
    const fee = BASE_FEE;
    // Prepare metadata parameter (Option<String>)
    const metadataParam = userData.metadata
      ? nativeToScVal(userData.metadata, { type: "string" })
      : xdr.ScVal.scvVoid(); // For None/null case

    const tx = new TransactionBuilder(account, { fee })
      .setNetworkPassphrase(Networks.TESTNET)
      .setTimeout(30)
      .addOperation(
        contract.call(
          "store_data",
          nativeToScVal(userData.reciverKey, { type: "address" }), // user (Address)
          nativeToScVal(userData.amount, { type: "i128" }), // used_amount (i128)
          nativeToScVal(userData.cid, { type: "string" }), // cid (String)
          nativeToScVal(userData.prevTxn, { type: "string" }), // prev_txn (String)
          metadataParam // metadata (Option<String>)
        )
      )
      .build();
    const prepardTx = await sorobanServer.prepareTransaction(tx);
    prepardTx.sign(sourceKeyPair);
    const result = await sorobanServer.sendTransaction(prepardTx);
    if (result.errorResult) {
      console.log("Error:", result.errorResult);
    }
    if (result.status === "PENDING") {
      let txResponse = await sorobanServer.getTransaction(result.hash);
      let attempts = 0;
      const maxAttempts = 30;

      while (txResponse.status === "NOT_FOUND" && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        txResponse = await sorobanServer.getTransaction(result.hash);
        attempts++;
      }

      console.log("Final status:", txResponse.status);
      return txResponse;
    }

    return result.hash;
  } catch (error) {
    return error;
  }
};
