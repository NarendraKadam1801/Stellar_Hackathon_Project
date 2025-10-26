import mongoose from "mongoose";
export declare const postModel: mongoose.Model<{
    Description?: string | null | undefined;
    Title?: string | null | undefined;
    Type?: string | null | undefined;
    Location?: string | null | undefined;
    ImgCid?: string | null | undefined;
    NgoRef?: mongoose.Types.ObjectId | null | undefined;
    NeedAmount?: number | null | undefined;
    CollectedAmount?: number | null | undefined;
    WalletAddr?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    Description?: string | null | undefined;
    Title?: string | null | undefined;
    Type?: string | null | undefined;
    Location?: string | null | undefined;
    ImgCid?: string | null | undefined;
    NgoRef?: mongoose.Types.ObjectId | null | undefined;
    NeedAmount?: number | null | undefined;
    CollectedAmount?: number | null | undefined;
    WalletAddr?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    Description?: string | null | undefined;
    Title?: string | null | undefined;
    Type?: string | null | undefined;
    Location?: string | null | undefined;
    ImgCid?: string | null | undefined;
    NgoRef?: mongoose.Types.ObjectId | null | undefined;
    NeedAmount?: number | null | undefined;
    CollectedAmount?: number | null | undefined;
    WalletAddr?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    Description?: string | null | undefined;
    Title?: string | null | undefined;
    Type?: string | null | undefined;
    Location?: string | null | undefined;
    ImgCid?: string | null | undefined;
    NgoRef?: mongoose.Types.ObjectId | null | undefined;
    NeedAmount?: number | null | undefined;
    CollectedAmount?: number | null | undefined;
    WalletAddr?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    Description?: string | null | undefined;
    Title?: string | null | undefined;
    Type?: string | null | undefined;
    Location?: string | null | undefined;
    ImgCid?: string | null | undefined;
    NgoRef?: mongoose.Types.ObjectId | null | undefined;
    NeedAmount?: number | null | undefined;
    CollectedAmount?: number | null | undefined;
    WalletAddr?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    Description?: string | null | undefined;
    Title?: string | null | undefined;
    Type?: string | null | undefined;
    Location?: string | null | undefined;
    ImgCid?: string | null | undefined;
    NgoRef?: mongoose.Types.ObjectId | null | undefined;
    NeedAmount?: number | null | undefined;
    CollectedAmount?: number | null | undefined;
    WalletAddr?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=post.model.d.ts.map