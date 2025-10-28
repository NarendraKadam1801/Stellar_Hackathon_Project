import { PinataSDK } from "pinata";
import fs from "fs";
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT || "87413611f292892656bb",
    pinataGateway: process.env.PINATA_GATEWAY || "azure-official-egret-883.mypinata.cloud"
});
const retriveFromIpfs = async (cid) => {
    try {
        const data = await pinata.gateways.public.get(cid);
        if (!data)
            throw new Error("Something went wrong while retrieving data from IPFS");
        return {
            success: true,
            data,
            cid
        };
    }
    catch (error) {
        return {
            success: false,
            error,
            cid
        };
    }
};
const uploadOnIpfs = async (data) => {
    try {
        const uploadData = await pinata.upload.public.json(data);
        if (!uploadData)
            throw new Error("Something went wrong while uploading data to IPFS");
        return {
            success: true,
            cid: uploadData.cid,
        };
    }
    catch (error) {
        return {
            success: false,
            error,
        };
    }
};
const uploadOnIpfsBill = async (data) => {
    try {
        console.log("📁 File data received:", {
            path: data.path,
            filename: data.filename,
            originalname: data.originalname,
            mimetype: data.mimetype,
            size: data.size
        });
        // Check if file exists before reading
        if (!fs.existsSync(data.path)) {
            throw new Error(`File not found at path: ${data.path}`);
        }
        console.log("📁 Reading file from:", data.path);
        const fileBuffer = fs.readFileSync(data.path);
        console.log("📊 File size:", fileBuffer.length, "bytes");
        const file = new File([fileBuffer], data.originalname, { type: data.mimetype });
        console.log("🚀 Uploading to Pinata...");
        const uploadData = await pinata.upload.public.file(file);
        console.log("✅ Pinata upload response:", uploadData);
        if (!uploadData || !uploadData.cid) {
            throw new Error("No CID returned from Pinata");
        }
        // Clean up the uploaded file from local storage
        try {
            fs.unlinkSync(data.path);
            console.log("🗑️ Cleaned up local file");
        }
        catch (cleanupError) {
            console.warn("⚠️ Failed to cleanup local file:", cleanupError);
        }
        return {
            success: true,
            cid: uploadData.cid,
        };
    }
    catch (error) {
        console.error("❌ IPFS upload error:", error.message);
        return {
            success: false,
            error: error.message || error,
        };
    }
};
const deleteIpfsData = async (cid) => {
    try {
        const dataDelet = await pinata.files.public.delete(cid);
        if (!dataDelet)
            throw new Error("Something went wrong while deleting data from IPFS");
        return {
            success: true,
            cid,
        };
    }
    catch (error) {
        return {
            success: false,
            error,
        };
    }
};
export { retriveFromIpfs, uploadOnIpfs, deleteIpfsData, uploadOnIpfsBill };
//# sourceMappingURL=ipfs.services.js.map