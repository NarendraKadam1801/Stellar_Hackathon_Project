import { CID } from "multiformats";
const isValidCid = async (cid) => {
    try {
        CID.parse(cid);
        return true;
    }
    catch (error) {
        return false;
    }
};
const ImgFormater = async (cid) => {
    try {
        const ImgUrl = `https://${process.env.PINATA_GATEWAY || "azure-official-egret-883.mypinata.cloud"}/ipfs/${cid}`;
        if (!ImgUrl)
            throw new Error("Failed to generate image URL");
        return ImgUrl;
    }
    catch (error) {
        return {
            success: false,
            error
        };
    }
};
export { isValidCid, ImgFormater };
//# sourceMappingURL=ipfs.uitl.js.map