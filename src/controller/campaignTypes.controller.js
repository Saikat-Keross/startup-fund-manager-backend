import { date } from "zod";
import Fundraiser from "../models/fundraiser.model";
import Transaction from "../models/transaction.model";

export const getLatestCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const fetchWithinDate = new Date();
        fetchWithinDate.setDate(fetchWithinDate.getDate() - 7);
        console.log("Fetch within date:", fetchWithinDate);

        const latestCampaigns = await Fundraiser.find({
            status: "active",
            date: { $gte: fetchWithinDate }
        })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
        const totalCampaignsCount = await Fundraiser.countDocuments(latestCampaigns);
        res.status(200).json({
            latestCampaigns,
            currentPage: page,
            totalPages: Math.ceil(totalCampaignsCount / limit),
            totalCampaignsCount: totalCampaignsCount,
            apiType: "latestCampaigns"
        });
    } catch (error) {
        console.error("Error fetching fresh campaigns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getHotCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
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
                    end_date: { $first: '$end_date' },
                    goal_amount: { $first: '$goal_amount' },
                    category: { $first: '$category' },
                    story: { $first: '$story' },
                    owner: { $first: '$owner' },
                    current_amount: { $first: '$current_amount' },
                    image_url: { $first: '$image_url' }
                }
            },
            {
                $addFields: {
                    fundingSpeed: {
                        $divide: [
                            { $toDouble: '$totalFunding' },
                            {
                                $cond: {
                                    if: { $eq: [{ $dateDiff: { startDate: '$createdAt', endDate: new Date(), unit: 'hour' } }, 0] },
                                    then: 1, // Prevent division by zero
                                    else: { $dateDiff: { startDate: '$createdAt', endDate: new Date(), unit: 'hour' } }
                                }
                            }
                        ]
                    }
                }
            },
            { $sort: { fundingSpeed: -1 } }, // Sorting in descending order for "hot" campaigns
            { $skip: skip },
            { $limit: limit }
        ]);


        console.log("Hot Campaigns:", hotCampaigns.length);
        const totalCampaignsCount = await Fundraiser.countDocuments({ status: 'active' });
        res.status(200).json({
            hotCampaigns,
            currentPage: page,
            totalPages: Math.ceil(hotCampaigns?.length / limit),
            totalCampaignsCount: hotCampaigns?.length,
            apiType: "trendingCampaigns"
        });
    } catch (error) {
        console.error("Error fetching hot campaigns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const willBeClosedCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;
        const today = new Date();
        const next8Days = new Date();
        next8Days.setDate(today.getDate() + 8);
        console.log(next8Days)
        const willBeClosedCampaigns = await Fundraiser.aggregate([
            {
                $match: {
                    status: "active",
                    end_date: {
                        $gte: today,
                        $lt: next8Days
                    }
                }
            },
            {
                $addFields: {
                    daysLeft: {
                        $dateDiff: {
                            startDate: today,
                            endDate: "$end_date",
                            unit: "day"
                        }
                    }
                }
            },
            { $sort: { daysLeft: 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        console.log("willBeClosedCampaigns:", willBeClosedCampaigns);
        res.status(200).json({
            willBeClosedCampaigns,
            currentPage: page,
            totalPages: Math.ceil(willBeClosedCampaigns?.length / limit),
            totalCampaignsCount: willBeClosedCampaigns?.length,
            apiType: "willBeClosedCampaign"
        });

    } catch (error) {
        console.error("Error fetching closing campaigns:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const raisedMostMoneylastweek = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit

        // const raisedMostMoneylastweek = await Fundraiser.aggregate([
        //     {$match:{status:"active",end_date: { $gt: new Date() } }},
        //     {$lookup:{
        //         from:"transactions",
        //         localField:"_id",
        //         foreignField:"fundraiserId",
        //         as:"transactions"
        //     }},
        //     { $unwind: { path: '$transactions', preserveNullAndEmptyArrays: true } },
        //     {$group:{
        //         _id:"$_id",
        //         title:{$first:"$title"},
        //         totalFunding:{$sum:{$toDouble:"$transactions.amount"}},
        //         transactionCount:{$sum:1},
        //         createdAt:{$first:"$date"},
        //         end_date:{$first:"$end_date"},
        //         goal_amount:{$first:"$goal_amount"},
        //         category:{$first:"$category"},
        //         story:{$first:"$story"},
        //         owner:{$first:"$owner"},
        //         current_amount:{$first:"$current_amount"},
        //     }},
        // ])
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const raisedMostMoneyLastWeek = await Fundraiser.aggregate([
            {
                $match: {
                    status: "active",
                    end_date: { $gt: today }
                }
            },
            {
                $lookup: {
                    from: "transactions",
                    localField: "_id",
                    foreignField: "fundraiserId",
                    as: "transactions"
                }
            },
            {
                $unwind: { path: "$transactions", preserveNullAndEmptyArrays: true }
            },
            {
                $match: {
                    "transactions.createdAt": { $gte: lastWeek, $lt: today }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    totalFunding: { $sum: { $toDouble: "$transactions.amount" } },
                    transactionCount: { $sum: 1 },
                    createdAt: { $first: "$date" },
                    end_date: { $first: "$end_date" },
                    goal_amount: { $first: "$goal_amount" },
                    category: { $first: "$category" },
                    story: { $first: "$story" },
                    owner: { $first: "$owner" },
                    current_amount: { $first: "$current_amount" },
                    image_url: { $first: "$image_url" }
                }
            },
            {
                $sort: { totalFunding: -1 }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        console.log(raisedMostMoneyLastWeek);
        res.status(200).json({
            raisedMostMoneyLastWeek,
            currentPage: page,
            totalPages: Math.ceil(raisedMostMoneyLastWeek?.length / limit),
            totalCampaignsCount: raisedMostMoneyLastWeek?.length,
            apiType: "raisedMostMoneyLastWeek"
        });


    } catch (error) {

    }
}