import Fundraiser from "../models/fundraiser.model";
import Transaction from "../models/transaction.model";

export const getLatestCampaigns = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const latestCampaigns = await Fundraiser.find({ "status": "active" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalCampaignsCount = await Fundraiser.countDocuments(latestCampaigns);
        res.status(200).json({
            latestCampaigns,
            currentPage: page,
            totalPages: Math.ceil(totalCampaignsCount / limit),
            totalCampaignsCount: totalCampaignsCount
        });
    } catch (error) {
        console.error("Error fetching fresh campaigns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getHotCampaigns = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        // const hotCampaigns = await Fundraiser.aggregate([
        //     { $match: { status: 'active' } },
        //     {
        //         $lookup: {
        //             from: 'transactions',
        //             localField: '_id',
        //             foreignField: 'fundraiserId',
        //             as: 'transactions',
        //         }
        //     },
        //    { $unwind: { path: "$transactions", preserveNullAndEmptyArrays: true } },
        //     { $addFields: { totalFunding: { $sum: '$transactions.amount' } } },
        //     {
        //         $addFields: {
        //             fundingSpeed: {
        //                 $divide: [{ $sum: '$transactions.amount'}, {
        //                     $dateDiff: {
        //                         startDate: '$createdAt',
        //                         endDate: new Date(),
        //                         unit: 'hour'
        //                     }
        //                 }]
        //             }
        //         }
        //     },
        //     { $sort: { fundingSpeed: -1 } },
        //     { $skip: skip },
        //     { $limit: limit }
        // ]);
        const hotCampaigns = await Fundraiser.aggregate([
            { $match: { status: 'active', end_date: { $gt: new Date() } } },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'fundraiserId',
                    as: 'transactions',
                }
            },

            { $unwind: { path: '$transactions', preserveNullAndEmptyArrays: true } },

            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    totalFunding: { $sum: { $divide: [{ $toDouble: '$transactions.amount' }, 100] } },
                    transactionCount: { $sum: 1 },
                    createdAt: { $first: '$date' },
                    endDate: { $first: '$end_date' },
                    goal_amount: { $first: '$goal_amount' },
                    category: { $first: '$category' },
                    story: { $first: '$story' },
                }
            },
            {
                $addFields: {
                    fundingSpeed: {
                        $divide: [
                            { $toDouble: '$totalFunding' },
                            { $dateDiff: { startDate: '$createdAt', endDate: new Date(), unit: 'hour' } },
                        ]
                    }
                }
            },
            { $sort: { fundingSpeed: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);


        console.log("Hot Campaigns:", hotCampaigns);
        const totalCampaignsCount = await Fundraiser.countDocuments({ status: 'active' });
        res.status(200).json({
            hotCampaigns,
            currentPage: page,
            totalPages: Math.ceil(totalCampaignsCount / limit),
            totalCampaignsCount: totalCampaignsCount
        });
    } catch (error) {
        console.error("Error fetching hot campaigns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

