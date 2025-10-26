import { rpc } from "@stellar/stellar-sdk";
interface UserDataWallet {
    privateKey: string;
    reciverKey: string;
    amount: Number;
    cid: string;
    prevTxn: string;
    metadata?: string;
}
export declare const saveContractWithWallet: (userData: UserDataWallet) => Promise<rpc.Api.GetTransactionResponse | rpc.Api.SendTransactionResponse>;
export declare const getLatestData: (privateKey: string) => Promise<unknown>;
export {};
//# sourceMappingURL=smartContract.handler.stellar.d.ts.map