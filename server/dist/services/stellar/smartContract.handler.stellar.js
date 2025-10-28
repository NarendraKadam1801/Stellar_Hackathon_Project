import { TransactionBuilder, Keypair, nativeToScVal, BASE_FEE, Contract, Networks, xdr, rpc } from "@stellar/stellar-sdk";
const SOROBAN_RPC_URL = process.env.SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
const sorobanServer = new rpc.Server(SOROBAN_RPC_URL);
export const saveContractWithWallet = async (userData) => {
    try {
        const contract = new Contract(process.env.CONTRACTIDF || "CDGGEIPVLL67QR5TFHKWJ776L6VZSRIV3LMHHKXHPPUXQWTWLBBQ4QO2");
        const sourceKeyPair = Keypair.fromSecret(userData.privateKey);
        const accountId = sourceKeyPair.publicKey();
        const account = await sorobanServer.getAccount(accountId);
        const fee = BASE_FEE;
        // Prepare metadata parameter (Option<String>)
        const metadataParam = userData.metadata
            ? nativeToScVal(userData.metadata, { type: "string" })
            : xdr.ScVal.scvVoid(); // For None/null case
        const transaction = new TransactionBuilder(account, { fee })
            .setNetworkPassphrase(Networks.TESTNET)
            .setTimeout(30)
            .addOperation(contract.call("store_data", nativeToScVal(accountId, { type: "address" }), // user (Address) - FIXED: Use accountId instead of reciverKey
        nativeToScVal(userData.amount, { type: "i128" }), // used_amount (i128)
        nativeToScVal(userData.cid, { type: "string" }), // cid (String)
        nativeToScVal(userData.prevTxn, { type: "string" }), // prev_txn (String)
        metadataParam // metadata (Option<String>)
        ))
            .build();
        const preparedTx = await sorobanServer.prepareTransaction(transaction);
        preparedTx.sign(sourceKeyPair);
        const result = await sorobanServer.sendTransaction(preparedTx);
        console.log("Store Data Transaction:");
        console.log("hash:", result.hash);
        console.log("status:", result.status);
        console.log("errorResult:", result.errorResult);
        if (result.errorResult) {
            throw new Error(`Transaction failed: ${result.errorResult}`);
        }
        // Wait for transaction confirmation
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
        return result;
    }
    catch (error) {
        console.error("Error storing data:", error);
        throw error; // FIXED: Throw error instead of returning it
    }
};
// Add function to get latest data (similar to your working code)
export const getLatestData = async (privateKey) => {
    try {
        const contract = new Contract(process.env.CONTRACTIDF || "CDGGEIPVLL67QR5TFHKWJ776L6VZSRIV3LMHHKXHPPUXQWTWLBBQ4QO2");
        const sourceKeyPair = Keypair.fromSecret(privateKey);
        const accountId = sourceKeyPair.publicKey();
        const account = await sorobanServer.getAccount(accountId);
        const fee = BASE_FEE;
        const transaction = new TransactionBuilder(account, { fee })
            .setNetworkPassphrase(Networks.TESTNET)
            .setTimeout(30)
            .addOperation(contract.call("get_latest", nativeToScVal(accountId, { type: "address" }) // user (Address)
        ))
            .build();
        const preparedTx = await sorobanServer.prepareTransaction(transaction);
        const result = await sorobanServer.simulateTransaction(preparedTx);
        if ('retval' in result) {
            // Parse the result
            const returnValue = result.retval;
            console.log("Latest Data:");
            console.log("Raw return value:", returnValue);
            return returnValue;
        }
        else {
            console.log("No data found or error:", result);
            return null;
        }
    }
    catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};
//# sourceMappingURL=smartContract.handler.stellar.js.map