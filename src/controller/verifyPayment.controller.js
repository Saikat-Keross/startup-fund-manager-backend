
// const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);
// async function verifyPayment(req, res) {
//     const { session_id } = req.query;
//     if (!session_id) {
//         return res.status(400).send("Session ID is required.");
//     }

//     try {
//         const session = await stripe.checkout.sessions.retrieve(session_id);
//         const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
//         console.log("paymentIntent",paymentIntent);
//         if (paymentIntent.status === 'succeeded') {
//             res.send("Thank you for your payment!");
//         } else {
//             res.send("There was a problem with your payment. Please check your payment method or contact support.");
//         }
//     } catch (error) {
//         console.error('Error retrieving payment information:', error);
//         res.status(500).send('Internal Server Error');
//     }
// }

// module.exports = verifyPayment;



const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//import Contribution from '../models/contribution.model';
import Transaction from '../models/transaction.model';
import Fundraiser from '../models/fundraiser.model';


const CC = require('currency-converter-lt')

let currencyConverter = new CC()

let ratesCacheOptions = {
    isRatesCaching: true, // Set this boolean to true to implement rate caching
    ratesCacheDuration: 3600 // Set this to a positive number to set the number of seconds you want the rates to be cached. Defaults to 3600 seconds (1 hour)
}

currencyConverter = currencyConverter.setupRatesCache(ratesCacheOptions)

async function verifyPayment(req, res) {
    const userId = req?.user?.id
    console.log('userId',req.user);
    const { session_id, campaign_id } = req.query;
    console.log('session_id', session_id);
    console.log('campaign_id', campaign_id);
    if (!session_id) {
        return res.status(400).send("Session ID is required.");
    }


    // async function convertCurrency(amount, currency) {
    //     if (currency.toLowerCase() === 'usd') {
    //         return amount / 100; // Convert cents to dollars if USD
    //     } else {
    //         try {
    //             const convertedAmount = await currencyConverter.convert(amount, currency.toUpperCase(), 'USD');
    //             return convertedAmount; // Assuming the library directly returns the converted amount in USD
    //         } catch (error) {
    //             console.error('Error converting currency:', error);
    //             throw new Error(`Failed to convert currency from ${currency} to USD: ${error.message}`);
    //         }
    //     }
    // }
    

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        console.log('paymentIntent', paymentIntent);
        switch (paymentIntent.status) {
            case 'succeeded':
                const transaction = await Transaction.create({
                    amount: paymentIntent.amount,
                    fundraiserId: campaign_id,
                    date: new Date(),
                    transactionId: paymentIntent.id,
                    status:"succeeded",
                    userId:userId,
                    currency:paymentIntent.currency
                });
                console.log('transaction', transaction);
                // Now update the corresponding Fundraiser
                console.log()
                const fundraiser = await Fundraiser.findById(transaction?.fundraiserId);
                if (!fundraiser) throw new Error('Fundraiser not found');
            
                fundraiser.current_amount += transaction.amount/100;
                fundraiser.transactions.push(transaction.transactionId);
                await fundraiser.save();
                res.redirect(`${process.env.CLIENT_ORIGIN}/quantmai/detailCampaign/${campaign_id}`);
               // res.json({fundraiser});

                break;
            case 'requires_action':
                // The payment requires additional action (e.g., 3D Secure)
                res.send("Your payment requires additional authorization.");
                break;
            case 'requires_payment_method':
                // The payment attempt failed, and a new payment method is needed
                res.send("Your payment could not be processed, please try a different payment method.");
                break;
            case 'canceled':
                // Payment was canceled
                res.send("Your payment was canceled.");
                break;
            case 'processing':
                // Payment is still processing
                res.send("Your payment is still processing, please wait for confirmation.");
                break;
            case 'requires_confirmation':
                // Payment requires confirmation, typically handled server-side
                res.send("Your payment is being confirmed, please wait for confirmation.");
                break;
            case 'requires_review':
                // Payment is under review
                res.send("Your payment is under review.");
                break;
            default:
                // Handle other cases or unknown statuses
                res.send("Your payment is being processed, please check back later for the status.");
                break;
        }
    } catch (error) {
        console.error('Error retrieving payment information:', error);
        res.status(500).send('Internal Server Error');
    }
}

export default verifyPayment;