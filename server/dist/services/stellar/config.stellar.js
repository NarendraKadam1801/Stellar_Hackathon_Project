import { Keypair, Networks, Horizon } from "@stellar/stellar-sdk";
const BLOCKCHAIN_NETWORK = process.env.BLOCKCHAIN_NETWORK || "https://horizon-testnet.stellar.org";
export const STELLAR_CONFIG = {
    server: new Horizon.Server(BLOCKCHAIN_NETWORK),
    networkPassphrase: Networks.TESTNET,
};
export const createKeypair = () => Keypair.random();
//# sourceMappingURL=config.stellar.js.map