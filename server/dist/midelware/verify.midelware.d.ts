import { Request, Response, NextFunction } from "express";
interface RequestK extends Request {
    NgoId?: string;
    user?: any;
}
declare const verifyToken: (req: RequestK, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export { verifyToken };
//# sourceMappingURL=verify.midelware.d.ts.map