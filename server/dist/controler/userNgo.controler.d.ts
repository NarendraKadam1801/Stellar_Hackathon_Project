import { Request, Response } from "express";
export interface userSingupData {
    ngoName: string;
    regNumber: string;
    description: string;
    email: string;
    phoneNo: string;
    passwrod: string;
    publicKey?: string;
    privateKey?: string;
}
export interface userLoginData {
    email: string;
    password: string;
}
declare const singup: (req: Request, res: Response, next: import("express").NextFunction) => void;
declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
export { singup, login };
//# sourceMappingURL=userNgo.controler.d.ts.map