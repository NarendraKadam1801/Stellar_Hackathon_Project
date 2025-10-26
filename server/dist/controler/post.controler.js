import AsyncHandler from "../util/asyncHandler.util.js";
import { ApiError } from "../util/apiError.util.js";
import { ApiResponse } from "../util/apiResponse.util.js";
import { Types } from "mongoose";
import { getPosts, savePostData } from "../dbQueries/post.Queries.js";
const getAllPost = AsyncHandler(async (req, res) => {
    const postData = await getPosts();
    if (!postData)
        throw new ApiError(404, "post data not found");
    return res.status(200).json(new ApiResponse(200, postData, "found data"));
});
const createPost = AsyncHandler(async (req, res) => {
    let data = req.body;
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