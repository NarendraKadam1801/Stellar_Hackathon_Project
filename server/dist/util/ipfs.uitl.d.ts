declare const isValidCid: (cid: string) => Promise<boolean>;
declare const ImgFormater: (cid: string) => Promise<string | {
    success: boolean;
    error: any;
}>;
export { isValidCid, ImgFormater };
//# sourceMappingURL=ipfs.uitl.d.ts.map