import {Keypair, Networks,Horizon, rpc} from "@stellar/stellar-sdk";


export const STELLAR_CONFIG={
    server:new Horizon.Server (process.env.BLOCKCHAIN_NETWORK as string),
    networkPassphrase: Networks.TESTNET,
}

export const createKeypair=()=>Keypair.random();
