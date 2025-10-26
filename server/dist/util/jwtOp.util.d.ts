interface TokenPayload {
    email?: string;
    NgoName?: string;
    walletAddr?: string;
    id?: string;
}
declare const genAccessToken: (user: TokenPayload) => Promise<never>;
declare const genRefreshToken: (user: TokenPayload) => Promise<never>;
export { genAccessToken, genRefreshToken };
//# sourceMappingURL=jwtOp.util.d.ts.map