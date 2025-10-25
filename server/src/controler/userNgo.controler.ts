import { Request, Response } from "express";
import AsyncHandler from "../util/asyncHandler.util.js";
import { ApiError } from "../util/apiError.util.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { findUser, findUserWithTokenAndPassCheck, saveDataAndToken } from "../dbQueries/user.Queries.js";

export interface userSingupData {
  ngoName: string;
  regNumber: string;
  description: string;
  email: string;
  phoneNo: string;
  passwrod: string;
  publicKey?:string;
  privateKey?:string;
}

export interface userLoginData {
    email:string;
    password:string;
}

const singup = AsyncHandler(async (req: Request, res: Response) => {
  const userData: userSingupData = req.body;
  if (!userData) throw new ApiError(400, "Invalid data");
  const findUserData = await findUser({ email: userData.email });
  if(findUserData) throw new ApiError(401,"user found ");
  const SaveData=saveDataAndToken(userData);
  if(!SaveData) throw new ApiError(500,`something went wrong while saving data${SaveData}`)
  return res.status(200).json(new ApiResponse(200,SaveData,"Successful"));
});


const login=AsyncHandler(async (req:Request,res:Response)=>{
    const userData:userLoginData=req.body;
    if(!userData) throw new ApiError(400,"invalid data");
    const dataCheck:any=await findUserWithTokenAndPassCheck(userData);
    if(!dataCheck) throw new ApiError(500,`something went wrong while checking ${dataCheck}`);
    const {accessToken,refreshToken}=dataCheck;
    return res.status(200).cookie('accessToken',accessToken).cookie('refreshToken',refreshToken).json(new ApiResponse(200,dataCheck,"user confirm"));
})


export { singup,login };
