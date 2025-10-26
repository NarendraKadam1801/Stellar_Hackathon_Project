import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../util/asyncHandler.util.js";
import { ApiError } from "../util/apiError.util.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { Types } from "mongoose";
import { getPosts, savePostData } from "../dbQueries/post.Queries.js";

export interface PostData{
    Title:string;
    Type:string;
    Description:string;
    Location:string;
    ImgCid:string;
    NeedAmount:string;
    WalletAddr:string;
    NgoRef?:Types.ObjectId; // Optional since it will be set by middleware
}

interface RequestK extends Request{
    NgoId?:string
}

const getAllPost=AsyncHandler(async(req:Request,res:Response)=>{
    const postData=await getPosts();
    if(!postData) throw new ApiError(404,"post data not found");
    return res.status(200).json(new ApiResponse(200,postData,"found data"));
});

const createPost=AsyncHandler(async (req:RequestK,res:Response)=>{
    let data:PostData=req.body;
    
    // NgoRef should be set by the verifyToken middleware
    if (!req.NgoId) {
        throw new ApiError(401, "NGO authentication required");
    }
    
    // Ensure NgoRef is set
    data.NgoRef = new Types.ObjectId(req.NgoId);
    
    if(!data) throw new ApiError(400,"invalid data");
    const saveData=await savePostData(data);
    if(!saveData) throw new ApiError(500,`somethign went wrong while saving post data ${saveData}`);
    return res.status(200).json(new ApiResponse(200,saveData,"post created"));
});

export {
    createPost,
    getAllPost
}