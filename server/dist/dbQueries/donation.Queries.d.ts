import { Types } from "mongoose";
import { DonationData } from "../controler/payment.controler.js";
declare const getDonation: (transactionId: string) => Promise<any>;
declare const getAllDonation: () => Promise<any>;
declare const getDonationRelatedToPost: (postId: Types.ObjectId) => Promise<any>;
declare const createDonation: (donationData: DonationData) => Promise<any>;
export { getDonation, getAllDonation, getDonationRelatedToPost, createDonation };
//# sourceMappingURL=donation.Queries.d.ts.map