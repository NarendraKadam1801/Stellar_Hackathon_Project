import { userSingupData, userLoginData } from "../controler/userNgo.controler.js";
interface userData {
    email?: string;
    Id?: string;
}
declare const findUser: (userData: userData) => Promise<any>;
declare const saveDataAndToken: (userData: userSingupData) => Promise<any>;
declare const findUserWithTokenAndPassCheck: (userData: userLoginData) => Promise<any>;
declare const getPrivateKey: (Id: string) => Promise<string>;
export { findUser, saveDataAndToken, findUserWithTokenAndPassCheck, getPrivateKey };
//# sourceMappingURL=user.Queries.d.ts.map