import AsyncHandler from "../util/asyncHandler.util.js";
import { ApiError } from "../util/apiError.util.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { findUser, getPrivateKey } from "../dbQueries/user.Queries.js";
// Find user by email or ID
const findUserById = AsyncHandler(async (req, res) => {
    const { email, id } = req.query;
    if (!email && !id)
        throw new ApiError(400, "Email or ID is required");
    const user = await findUser({ email: email || undefined, Id: id || undefined });
    if (!user)
        throw new ApiError(404, "User not found");
    return res.status(200).json(new ApiResponse(200, user, "User found"));
});
// Get user's private key (admin only - should be protected)
const getUserPrivateKey = AsyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId)
        throw new ApiError(400, "User ID is required");
    const privateKey = await getPrivateKey(userId);
    if (!privateKey)
        throw new ApiError(404, "Private key not found");
    return res.status(200).json(new ApiResponse(200, { privateKey }, "Private key retrieved"));
});
export { findUserById, getUserPrivateKey };
//# sourceMappingURL=userManagement.controler.js.map