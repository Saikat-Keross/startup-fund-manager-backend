import Fundraiser from "../models/fundraiser.model";
import Transaction from "../models/transaction.model";
import mongoose from "mongoose";

const investorFundedCampaigns = async (investorId) => {
    console.log("Fetching funded campaigns for investor:", investorId);

    const campaigns = await Transaction.find({ investorId }).populate('fundraiserId');

    console.log("Funded campaigns retrieved:", campaigns);
    return campaigns;
};

// const getRecomendedCampaigns = async (req, res) => {
//     try {
//         const investorId = req.user?.id;
//         console.log("Investor ID:", investorId);

//         if (!investorId) {
//             return res.status(400).json({ error: "Investor ID is missing" });
//         }

//         const fundedCampaigns = await investorFundedCampaigns(investorId);

//         if (!fundedCampaigns.length) {
//             console.log("No funded campaigns found for this investor.");
//             return res.status(200).json({ message: "No recommendations available" });
//         }

//         const fundedCategories = fundedCampaigns.map(campaign => {
//             console.log("Campaign Details:", campaign);
//             return campaign.fundraiserId?.category;
//         }).filter(Boolean); // Remove undefined/null values

//         console.log("Funded Categories:", fundedCategories);

//         const recommendedCampaigns = await Fundraiser.find({ category: { $in: fundedCategories } }).limit(5);

//         console.log("Recommended Campaigns:", recommendedCampaigns);

//         res.status(200).json(recommendedCampaigns);
//     } catch (error) {
//         console.error("Error fetching recommended campaigns:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// export default getRecomendedCampaigns;



//get reccomended campaigns from investors previously invested categories

// const getRecomendedCampaignsTypesPreviouslyInvested = async (req,res) => {
//     try {
//         const investorId = req.user?.id;
//         console.log("Investor ID:", investorId);
//         if(!investorId){
//             return res.status(400).json({error: "Investor ID is missing"});
//         }
//         const recommendedCampaigns = await Transaction.aggregate([
//             {$match:{userId:new mongoose.Types.ObjectId(investorId)}},
//             // {$lookup:{
//             //     from:"fundraisers",
//             //     localField:"fundraiserId",
//             //     foreignField:"_id",
//             //     as:"fundraiserDetails"
//             // }}
//         ])
//         console.log("Recommended Campaigns:", recommendedCampaigns);
//         return res.status(200).json({recommendedCampaigns});
//     } catch (error) {

//     }
// }

const getInvestorFundedCampaigns = async (investorId) => {
    const fundedCampaigns = await Transaction.find(
        { userId: investorId },
        { fundraiserId: 1, _id: 0 }
    );

    return fundedCampaigns.map(campaign => campaign.fundraiserId);
};
const getRecomendedCampaignsTypesPreviouslyInvested = async (req, res) => {
    try {
        const investorId = req.user?.id;
        console.log("Investor ID:", investorId);
        if (!investorId) {
            return res.status(400).json({ error: "Investor ID is missing" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const fundedCampaignIds = await getInvestorFundedCampaigns(investorId);
        console.log("Investor Funded Campaigns:", fundedCampaignIds);

        const recommendedCampaigns = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(investorId) } },
            {
                $lookup: {
                    from: "fundraisers",
                    localField: "fundraiserId",
                    foreignField: "_id",
                    as: "fundraiserDetails"
                }
            },
            { $unwind: "$fundraiserDetails" },
            {
                $project: {
                    _id: 0,
                    categories: "$fundraiserDetails.category"
                }
            },
            {
                $lookup: {
                    from: "fundraisers",
                    localField: "categories",
                    foreignField: "category",
                    as: "recommendedCampaigns"
                }
            },
            { $unwind: "$recommendedCampaigns" },
            {
                $match: {
                    "recommendedCampaigns._id": {
                        $nin: fundedCampaignIds
                    }
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);
        res.status(200).json({
            page,
            limit,
            total: recommendedCampaigns.length,
            recommendedCampaigns
        });
        console.log("Recommended Campaigns:", recommendedCampaigns);
        //return res.status(200).json({ recommendedCampaigns });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



export default getRecomendedCampaignsTypesPreviouslyInvested;



// db.transactions.aggregate([
//     { $match: { investorId: ObjectId("INVESTOR_ID") } }, // Get transactions by this investor
//     { $lookup: {
//         from: "fundraisers",
//         localField: "fundraiserId",
//         foreignField: "_id",
//         as: "fundraiserDetails"
//     }},
//     { $unwind: "$fundraiserDetails" },
//     { $group: {
//         _id: null,
//         categories: { $addToSet: "$fundraiserDetails.category" } // Get unique invested categories
//     }},
//     { $lookup: {
//         from: "fundraisers",
//         localField: "categories",
//         foreignField: "category",
//         as: "recommendedCampaigns"
//     }},
//     { $unwind: "$recommendedCampaigns" },
//     { $match: { "recommendedCampaigns._id": { $nin: ["FUNDRAISER_IDS_INVESTOR_ALREADY_FUNDED"] } } }, // Avoid duplicates
//     { $limit: 5 }
//   ]);
