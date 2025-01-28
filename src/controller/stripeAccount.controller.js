import Fundraiser from '../models/fundraiser.model';
import User from '../models/user.model';
import sendEmail from '../service/sendEmail';
import sendStripeAccountCreatedEmail from '../utils/sendAccountCreationEmail'

const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY); // Fix typo (STRIPE_SECRECT_KEY → STRIPE_SECRET_KEY)

const getUserEmail = async (userId) => {
    if (!userId) return null;

    try {
        console.log('Fetching email for userId:', userId);
        const selectedUser = await User.findById(userId).select('email');
        console.log('email:', selectedUser.email)
        return selectedUser?.email || null;
    } catch (error) {
        console.error('Error fetching user email:', error);
        return null;
    }
};

export const createStripeAccount = async (req, res) => {
    try {
        const { campaignId } = req.params;

        if (!campaignId) {
            return res.status(400).json({ message: "Campaign ID is required" });
        }

        const fundraiser = await Fundraiser.findById(campaignId);
        if (!fundraiser) {
            return res.status(404).json({ message: "Fundraiser not found" });
        }

        console.log("Fundraiser details:", fundraiser);

        if (!fundraiser.userId) {
            return res.status(400).json({ message: "Fundraiser is missing a valid userId" });
        }

        const userEmail = await getUserEmail(fundraiser.userId);
        if (!userEmail) {
            return res.status(404).json({ message: "User email not found" });
        }
        console.log("userEmail in account creation:", userEmail);

        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: userEmail,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        console.log("Account created:", account)

        if (account?.id) {
            fundraiser.stripeId = account.id;
            console.log("fundraiser after adding stripeId",fundraiser);
            await fundraiser.save();
            res.status(201).json({ message: "Stripe account created successfully", stripeId: account.id });
            await sendStripeAccountCreatedEmail(userEmail);
        } else {
            res.status(500).json({ message: "Failed to create Stripe account" });
        }
    } catch (error) {
        console.error('Error creating Stripe account:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
