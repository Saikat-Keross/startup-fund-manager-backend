import { Resend } from "resend";  // Correct import for the resend package
const resend = new Resend(process.env.RESEND_API_KEY);
export default async function sendRefundEmail(userEmail, refundAmount) {
    console.log("userEmail", userEmail);
    try {
        // Prepare the email content
        const emailContent = {
            from: "Acme <onboarding@resend.dev>",
            to: userEmail,
            subject: "Refund Successful",
            html: `
                <p>Dear Customer,</p>
                <p>We are happy to inform you that your refund request has been processed successfully.</p>
                <p><strong>Refund Amount:</strong> $${(refundAmount / 100).toFixed(2)}</p>
                <p>If you have any questions, please feel free to contact us.</p>
                <p>Best regards,<br/>Your Company Name</p>
            `,
        };

        // Send the email via Resend
        const response = await resend.emails.send(emailContent);
        console.log('Refund email sent successfully:', response);
    } catch (error) {
        console.error('Error sending refund email:', error);
    }
}
