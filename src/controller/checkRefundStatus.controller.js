const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);
async function getRefundStatus(refundId) {
    try {
        const refund = await stripe.refunds.retrieve(refundId);
        console.log('Refund Status:', refund.status);
        return refund.status;
    } catch (error) {
        console.error('Error retrieving refund:', error);
        throw new Error('Failed to retrieve refund status');
    }
}

