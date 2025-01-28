import sendEmail from "../service/sendEmail";
const sendStripeAccountCreatedEmail = async (userEmail) => {
    const subject = "Your Stripe Account Has Been Created";
    const htmlContent = `
        <p>Dear Customer,</p>
        <p>Your Stripe account has been successfully created. You can now receive payments directly.</p>
        <p>If you need any help setting up your account, please contact support.</p>
        <p>Best regards,<br/>Your Company Name</p>
    `;

    await sendEmail(userEmail, subject, htmlContent);
};

export default sendStripeAccountCreatedEmail;