const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import logger from '../utils/logger';

const getPriceId = async (req) => {
    const { amount, fullName, message } = req.body;
    console.log("body", req.body);
    

    const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: amount * 100,
        product_data: {
            name: `Funding for Google Inc.`, // name will be added later
        },
    });
    return price.id;
};

export const createCheckoutSession = async (req, res) => {
    const selectedCampaignId = req.params?.id;
    console.log("selectedCampaignId", selectedCampaignId.id);
    try {
        const priceId = await getPriceId(req);
        console.log("priceId", priceId);

        const session = await stripe.checkout.sessions.create({
            submit_type: 'donate',
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            custom_text: {
                // shipping_address: {
                //     message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
                // },
                submit: {
                    message: 'We\'ll email you instructions on how to get started.',
                },
                after_submit: {
                    message: 'Learn more about **your donation** on our site.',
                },
            },
            mode: 'payment',
            success_url: `http://192.168.3.7:8000/payment-check?session_id={CHECKOUT_SESSION_ID}&campaign_id=${selectedCampaignId}`,
            cancel_url: `http://192.168.3.7:8000/payment-check?session_id={CHECKOUT_SESSION_ID}&campaign_id=${selectedCampaignId}`,
        });

        //res.redirect(303, session.url);
        //res.redirect(303,)
       // console.log("session", session.payment_intent);
        res.json(session);
        res.status(200);
        //getPaymentIntent();
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('An error occurred');
    }
};

// app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (request, response) => {
//     const sig = request.headers['stripe-signature'];

//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     } catch (err) {
//         return response.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the checkout.session.completed event
//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;
//         const paymentIntentId = session.payment_intent;

//         // Store the PaymentIntent ID in your database for future reference
//         storePaymentIntentId(session.id, paymentIntentId);

//         response.json({received: true});
//     } else {
//         response.status(200).json({received: true});
//     }
// });

// function storePaymentIntentId(sessionId, paymentIntentId) {
//     // Database logic to store the payment intent ID
//     console.log(`Storing Payment Intent ID: ${paymentIntentId} for Session ID: ${sessionId}`);
// }

// const getPaymentIntent = async() => {
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: 2000, // e.g., $20, specified in cents
//         currency: 'usd',
//         // Optionally, specify other parameters like customer or payment method
//     });
    
//     // Later retrieve it using its ID
//     const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
//     console.log("Retrieved PaymentIntent ID:", retrievedPaymentIntent);
// }

module.exports = {
    createCheckoutSession,
};



// const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);
// import logger from '../utils/logger';

// // Helper function to create a Payment Intent
// async function createPaymentIntent(amount, fullName,message) {
//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100, 
//             currency: 'usd',
//             automatic_payment_methods: {
//                 enabled: true,
//             },
//         });
//         return paymentIntent;
//     } catch (error) {
//         logger.error('Error creating payment intent:', error);
//         throw error;  
//     }
// }

// export const createCheckoutSession = async (req, res) => {
//     try {
//         const { amount, fullName,message } = req.body; 
//         const paymentIntent = await createPaymentIntent(amount, fullName,message);

//         const session = await stripe.checkout.sessions.create({
//             payment_intent_data: {
//                 payment_intent: paymentIntent.id,
//             },
//             line_items: [{
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: 'Custom Donation',
//                     },
//                     unit_amount: amount * 100,
//                 },
//                 quantity: 1,
//             }],
//             mode: 'payment',
//             success_url: `https://ikoncloud-dev.keross.com/portal/ikon2/login.html`,
//             cancel_url: `https://ikoncloud.keross.com/portal/ikon2/login.html`,
//         });

//         console.log("Checkout Session:", session);
//         res.status(200).json(session);
//     } catch (error) {
//         console.error('Error creating checkout session:', error);
//         res.status(500).send('An error occurred');
//     }
// };

// module.exports = {
//     createCheckoutSession,
// };
