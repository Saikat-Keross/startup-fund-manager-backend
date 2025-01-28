const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY);

const createOnboardingLink = async (req, res) => {
    try {
       // const { stripeAccountId } = req.body;
       const stripeAccountId = "acct_1Qm9aiQjZT9ebqAF"

        if (!stripeAccountId) {
            return res.status(400).json({ message: "Stripe account ID is required" });
        }

        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId, // Stripe account ID of the fundraiser
            refresh_url: `http://localhost:3000/reauth`, // If onboarding expires
            return_url: `http://localhost:3000/dashboard`, // After onboarding completes
            type: 'account_onboarding',
        });
        console.log("accountLink",accountLink);
        res.json({ url: accountLink.url });
    } catch (error) {
        console.error("Error creating onboarding link:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export default createOnboardingLink
