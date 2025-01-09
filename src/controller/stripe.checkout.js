const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);

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
            success_url: `https://ikoncloud-dev.keross.com/portal/ikon2/login.html`,
            cancel_url: `https://ikoncloud.keross.com/portal/ikon2/login.html`,
        });

        //res.redirect(303, session.url);
        //res.redirect(303,)
        console.log("session", session);
        res.json(session);
        res.status(200);

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('An error occurred');
    }
};

module.exports = {
    createCheckoutSession,
};
