import mongoose from "mongoose";
export declare const donationModel: mongoose.Model<{
    currentTxn?: string | null | undefined;
    postIDs?: mongoose.Types.ObjectId | null | undefined;
    Amount?: number | null | undefined;
    RemainingAmount?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    currentTxn?: string | null | undefined;
    postIDs?: mongoose.Types.ObjectId | null | undefined;
    Amount?: number | null | undefined;
    RemainingAmount?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    currentTxn?: string | null | undefined;
    postIDs?: mongoose.Types.ObjectId | null | undefined;
    Amount?: number | null | undefined;
    RemainingAmount?: number | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    currentTxn?: string | null | undefined;
    postIDs?: mongoose.Types.ObjectId | null | undefined;
    Amount?: number | null | undefined;
    RemainingAmount?: number | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    currentTxn?: string | null | undefined;
    postIDs?: mongoose.Types.ObjectId | null | undefined;
    Amount?: number | null | undefined;
    RemainingAmount?: number | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    currentTxn?: string | null | undefined;
    postIDs?: mongoose.Types.ObjectId | null | undefined;
    Amount?: number | null | undefined;
    RemainingAmount?: number | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=donation.model.d.ts.map