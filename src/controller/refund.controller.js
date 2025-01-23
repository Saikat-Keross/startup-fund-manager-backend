const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);
import getPaymentIntent from '../service/getPaymentIntents'; 
import Transaction from '../models/transaction.model';



export default async function createRefund(req, res) {
    try {
        const paymentIntentId = req.body?.paymentIntentId;
        if (!paymentIntentId) {
            return res.status(400).json({ error: 'PaymentIntent ID is required' });
        }

        const paymentIntent = await getPaymentIntent(paymentIntentId);

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntent,
        });
        try {
            const transaction = await Transaction.findById(paymentIntentId);
            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            transaction.refundId = refund.id;
            transaction.status = refund.status;
            transaction.amountRefunded = refund.amount;

            await transaction.save();


        } catch (error) {
            
        }
        return res.status(200).json({ success: true, refund });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
