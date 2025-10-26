import mongoose from "mongoose";
interface INgo {
    NgoName: string;
    RegNumber: string;
    Description: string;
    Email: string;
    PhoneNo: string;
    Password: string;
    PublicKey: string;
    PrivateKey: string;
    RefreshToken?: string;
}
interface INgoMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    generateTokens(): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
type INgoModel = mongoose.Model<INgo, {}, INgoMethods>;
export declare const ngoModel: mongoose.Model<INgo, {}, INgoMethods, {}, mongoose.Document<unknown, {}, INgo, {}, mongoose.DefaultSchemaOptions> & Omit<INgo & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, keyof INgoMethods> & INgoMethods, mongoose.Schema<INgo, INgoModel, INgoMethods, {}, {}, {}, mongoose.DefaultSchemaOptions, INgo, mongoose.Document<unknown, {}, mongoose.FlatRecord<INgo>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<mongoose.FlatRecord<INgo> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, keyof INgoMethods> & INgoMethods>>;
export {};
//# sourceMappingURL=user(Ngo).model.d.ts.map