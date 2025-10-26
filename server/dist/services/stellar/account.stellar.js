import { STELLAR_CONFIG, createKeypair } from "./config.stellar.js";
import { TransactionBuilder, Operation, Keypair, Account } from "@stellar/stellar-sdk";
//this function take's admin private key to fund , new account which are ngo via doing that 
//it create's new account on blockchain 
export const createAccount = async () => {
    const funderKey = Keypair.fromSecret(process.env.BASEACCOUNTST_KEY);
    const funderAccountDetail = await STELLAR_CONFIG.server.accounts().accountId(funderKey.publicKey()).call();
    const funderAccount = new Account(funderKey.publicKey(), funderAccountDetail.sequence);
    const newPair = createKeypair();
    const tx = new TransactionBuilder(funderAccount, {
        fee: (await STELLAR_CONFIG.server.fetchBaseFee()).toString(),
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    }).addOperation(Operation.createAccount({
        destination: newPair.publicKey(),
        startingBalance: "20"
    })).setTimeout(30).build();
    tx.sign(funderKey);
    await STELLAR_CONFIG.server.submitAsyncTransaction(tx);
    return {
        publicKey: newPair.publicKey(),
        secret: newPair.secret(),
    };
};
//destination is the public key that will receive the remaining native balance 
export const DeletAccount = async (secret, destination) => {
    const keypair = Keypair.fromSecret(secret);
    const Account = await STELLAR_CONFIG.server.loadAccount(keypair.publicKey());
    const tx = new TransactionBuilder(Account, {
        fee: (await STELLAR_CONFIG.server.fetchBaseFee()).toString(),
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
    }).addOperation(Operation.accountMerge({ destination })).setTimeout(30).build();
    tx.sign(keypair);
    await STELLAR_CONFIG.server.submitAsyncTransaction(tx);
};
// those two upper code are wrong , they are for testnet or horizon , make them for Futurenet(correct one , as soroban is need for it)
//# sourceMappingURL=account.stellar.js.map