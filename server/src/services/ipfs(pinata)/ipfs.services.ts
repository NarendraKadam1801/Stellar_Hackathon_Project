import {PinataSDK} from "pinata";
import fs from "fs";

const pinata=new PinataSDK({
    pinataJwt:process.env.PINATA_JWT,
    pinataGateway:process.env.PINATA_GATEWAY
});


const retriveFromIpfs=async(cid:string)=>{
    try {
        const data=await pinata.gateways.public.get(cid);
        if(!data) throw new Error("Somethign went wrong while retriving data from ipfs");
        return {
            success:true,
            data,
            cid
        };
    } catch (error) {
        return {
            success:false,
            error,
            cid
        }
        
    }
}

const uploadOnIpfs=async(data:Object)=>{
    try {
        const uploadData=await pinata.upload.public.json(data);
        if(!uploadData) throw new Error("Somethign went wrong while uploading data from ipfs");
        return {
            success:true,
            cid:uploadData.cid,
        }
    } catch (error) {
        return {
            success:false,
            error,
        }
    }
}


const uploadOnIpfsBill=async(data:Express.Multer.File)=>{
    try {
        const fileBuffer = fs.readFileSync(data.path);
        const file = new File([fileBuffer], data.originalname, { type: data.mimetype });
        const uploadData=await pinata.upload.public.file(file);

        if(!uploadData) throw new Error("Somethign went wrong while uploading data from ipfs");
        return {
            success:true,
            cid:uploadData.cid,
        }
    } catch (error) {
        return {
            success:false,
            error,
        }
    }
}

const deleteIpfsData=async(cid:string[])=>{
    try {
        const dataDelet=await pinata.files.public.delete(cid);
        if(!dataDelet) throw new Error("Somethign went wrong while deleting data from ipfs");
        return {
            success:true,
            cid,
        }
    } catch (error) {
         return {
            success:false,
            error,
        }
    }
}

export{
    retriveFromIpfs,
    uploadOnIpfs,
    deleteIpfsData,
    uploadOnIpfsBill
}

