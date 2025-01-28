const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function getPaymentIntent(paymentIntentId) {
    if (!paymentIntentId) {
        throw new Error('PaymentIntent ID is required');
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Error retrieving PaymentIntent:', error.message);
        throw new Error('Failed to retrieve PaymentIntent');
    }
}
