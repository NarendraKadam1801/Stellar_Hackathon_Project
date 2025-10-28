import AsyncHandler from "../util/asyncHandler.util.js";
import { ApiError } from "../util/apiError.util.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { Types } from "mongoose";
import { getPosts, savePostData } from "../dbQueries/post.Queries.js";
import { getDonationRelatedToPost } from "../dbQueries/donation.Queries.js";
import { getXLMtoINRRate } from "../util/exchangeRate.util.js";
const getAllPost = AsyncHandler(async (req, res) => {
    try {
        const postData = await getPosts();
        if (!postData)
            throw new ApiError(404, "post data not found");
        // Get live XLM to INR exchange rate
        const XLM_TO_INR_RATE = await getXLMtoINRRate();
        console.log(`📊 Using XLM/INR rate: ₹${XLM_TO_INR_RATE}`);
        // Calculate collected amount for each post
        const postsWithCollected = await Promise.all(postData.map(async (post) => {
            try {
                const donations = await getDonationRelatedToPost(post._id);
                // Sum XLM amounts and convert to INR
                const collectedXLM = donations.reduce((sum, donation) => {
                    return sum + (donation.Amount || 0);
                }, 0);
                const collectedINR = collectedXLM * XLM_TO_INR_RATE;
                // Convert to plain object if it's a Mongoose document
                const postObj = post.toObject ? post.toObject() : post;
                return {
                    ...postObj,
                    CollectedAmount: Math.round(collectedINR) // Amount in INR (rounded)
                };
            }
            catch (error) {
                console.error(`Error processing post ${post._id}:`, error);
                // Return post without CollectedAmount if error
                const postObj = post.toObject ? post.toObject() : post;
                return {
                    ...postObj,
                    CollectedAmount: 0
                };
            }
        }));
        return res.status(200).json(new ApiResponse(200, postsWithCollected, "found data"));
    }
    catch (error) {
        console.error("Error in getAllPost:", error);
        throw error;
    }
});
const createPost = AsyncHandler(async (req, res) => {
    let data = req.body;
    // NgoRef should be set by the verifyToken middleware
    if (!req.NgoId) {
        throw new ApiError(401, "NGO authentication required");
    }
    // Ensure NgoRef is set
    data.NgoRef = new Types.ObjectId(req.NgoId);
    if (!data)
        throw new ApiError(400, "invalid data");
    const saveData = await savePostData(data);
    if (!saveData)
        throw new ApiError(500, `somethign went wrong while saving post data ${saveData}`);
    return res.status(200).json(new ApiResponse(200, saveData, "post created"));
});
export { createPost, getAllPost };
//# sourceMappingURL=post.controler.js.map