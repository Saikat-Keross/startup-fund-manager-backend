// const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);
// import getPaymentIntent from '../service/getPaymentIntents';
// import Transaction from '../models/transaction.model';
// import Fundraiser from '../models/fundraiser.model';



// export default async function createCampaignRefund(req, res) {
//     try {
//         const campaignId = req.params.campaignid;
//         if (!campaignId) {
//             return res.status(400).json({ error: 'Campaign is required' });
//         }

//         const fundraiser = await Fundraiser.findById(campaignId);
//         const transactions = fundraiser?.transactions || [];
//         if (!transactions) {
//             return res.status(400).json({ error: 'There is no transactions' });
//         }

//         //const paymentIntent = await getPaymentIntent(transactions);


//         for (let i in transactions) {
//             let paymentIntent = transactions[i]
//             const refund = await stripe.refunds.create({
//                 payment_intent: paymentIntent,
//             });
//             try {
//                 const transaction = await Transaction.findById(paymentIntentId);
//                 if (!transaction) {
//                     return res.status(404).json({ error: "Transaction not found" });
//                 }

//                 transaction.refundId = refund.id;
//                 transaction.status = refund.status;
//                 transaction.amountRefunded = refund.amount;

//                 await transaction.save();

//                 return res.status(200).json({ success: true, refund });
//             } catch (error) {

//             }
//         }
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }







// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// import Transaction from '../models/transaction.model';
// import Fundraiser from '../models/fundraiser.model';

// export default async function createCampaignRefund(req, res) {
//     try {
//         const { campaignid } = req.params;

//         // Validate campaign ID
//         if (!campaignid) {
//             return res.status(400).json({ error: 'Campaign ID is required' });
//         }

//         // Fetch the campaign
//         const fundraiser = await Fundraiser.findById(campaignid);
//         if (!fundraiser) {
//             return res.status(404).json({ error: 'Campaign not found' });
//         }

//         const transactions = fundraiser.transactions || [];

//         // Check if transactions exist
//         if (transactions.length === 0) {
//             return res.status(400).json({ error: 'No transactions found for this campaign' });
//         }

//         const refundPromises = transactions.map(async (paymentIntent) => {
//             try {
//                 // Create refund in Stripe
//                 const refund = await stripe.refunds.create({ payment_intent: paymentIntent });

//                 // Find the transaction in the database
//                 const transaction = await Transaction.findOne({ transactionId: paymentIntent });
//                 if (!transaction) {
//                     return { paymentIntent, error: "Transaction not found" };
//                 }

//                 // Update transaction with refund details
//                 transaction.refundId = refund.id;
//                 transaction.status = refund.status;
//                 transaction.amountRefunded = refund.amount;
//                 await transaction.save();

//                 return { paymentIntent, refund };
//             } catch (error) {
//                 return { paymentIntent, error: error.message };
//             }
//         });

//         // Execute all refunds in parallel
//         const refundResults = await Promise.all(refundPromises);
//         const successRefunds = refundResults.filter(r => r.refund);
//         const failedRefunds = refundResults.filter(r => r.error);

//         return res.status(200).json({
//             success: true,
//             message: 'Refund processing completed',
//             successRefunds,
//             failedRefunds,
//         });

//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }


const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);
import Transaction from '../models/transaction.model';
import Fundraiser from '../models/fundraiser.model';
import User from '../models/user.model';
import jwt from 'jsonwebtoken'

import sendRefundEmail from '../utils/sendrefundEmail'
export default async function createCampaignRefund(req, res) {
    try {
        const { campaignid } = req.params;
        const userId = req?.user?.id
        
        // ✅ Validate campaign ID
        if (!campaignid) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        // ✅ Fetch the campaign
        const fundraiser = await Fundraiser.findById(campaignid);
        if (!fundraiser) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const transactions = fundraiser.transactions || [];

        // ✅ Check if transactions exist
        if (transactions.length === 0) {
            return res.status(400).json({ error: 'No transactions found for this campaign' });
        }

        const successRefunds = [];
        const failedRefunds = [];

        // ✅ Process refunds for each transaction
        for (const paymentIntent of transactions) {
            try {
                // Create refund in Stripe
                const refund = await stripe.refunds.create({ payment_intent: paymentIntent });

                console.log("Refund created", refund);

                // Check refund status
                if (refund.status === 'succeeded') {
                    // console.log("req.cookies",req.cookies['token']);
                    // const userToken = req.cookies['token'];
                    const refundAmount = refund.amount;

                    // // Decode JWT token
                    // const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
                    // console.log("decoded?.id",decoded?.id);

                    // Fetch user email
                    const user = await User.findById(userId).select('email');
                    const userEmail = user.email;

                    // Send the refund success email
                    await sendRefundEmail(userEmail, refundAmount);
                }

                // Fetch the transaction from the database
                const transaction = await Transaction.findOne({ transactionId: paymentIntent });

                console.log("transaction", transaction);

                if (!transaction) {
                    failedRefunds.push({ paymentIntent, error: "Transaction not found" });
                    continue;
                }

                // Update the transaction with refund details
                transaction.refundId = refund.id;
                transaction.status = refund.status;
                transaction.amountRefunded = refund.amount;
                await transaction.save();

                successRefunds.push({ paymentIntent, refund });
            } catch (error) {
                failedRefunds.push({ paymentIntent, error: error.message });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Refund processing completed',
            successRefunds,
            failedRefunds,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}