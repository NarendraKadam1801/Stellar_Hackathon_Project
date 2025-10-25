import {CID} from "multiformats"
const isValidCid=async(cid:string)=>{
    try {
        CID.parse(cid);
        return true;
    } catch (error) {
        return false;
    }
}

const ImgFormater=async(cid:string)=>{
    try {
        const ImgUrl=`https://${process.env.PINATA_GATEWAY}/ipfs/${cid}`;
        if(!ImgUrl) throw new Error("NO image url");
        return ImgUrl
    } catch (error) {
        return {
            success:false,
            error
        }
    }
}

export {
    isValidCid,
    ImgFormater
}