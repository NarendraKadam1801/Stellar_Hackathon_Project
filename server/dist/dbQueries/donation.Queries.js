import { donationModel } from "../model/donation.model.js";
const getDonation = async (transactionId) => {
    try {
        return await donationModel.findOne({ currentTxn: transactionId });
    }
    catch (error) {
        return error;
    }
};
const getAllDonation = async () => {
    try {
        return await donationModel.find();
    }
    catch (error) {
        return error;
    }
};
const getDonationRelatedToPost = async (postId) => {
    try {
        return await donationModel.find({ postIDs: postId });
    }
    catch (error) {
        return error;
    }
};
const createDonation = async (donationData) => {
    try {
        if (!donationData)
            throw new Error("invalid data");
        return await donationModel.create({
            currentTxn: donationData.TransactionId,
            postIDs: donationData.postID,
            Amount: donationData.Amount,
        });
    }
    catch (error) {
        return error;
    }
};
export { getDonation, getAllDonation, getDonationRelatedToPost, createDonation };
//# sourceMappingURL=donation.Queries.js.map