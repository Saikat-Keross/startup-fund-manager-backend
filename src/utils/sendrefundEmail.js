import sendEmail from '../service/sendEmail';

const sendRefundEmail = async (userEmail, refundAmount) => {
    const subject = "Refund Successful";
    const htmlContent = `
        <p>Dear Customer,</p>
        <p>We are happy to inform you that your refund request has been processed successfully.</p>
        <p><strong>Refund Amount:</strong> $${(refundAmount / 100).toFixed(2)}</p>
        <p>If you have any questions, please feel free to contact us.</p>
        <p>Best regards,<br/>Your Company Name</p>
    `;

    await sendEmail(userEmail, subject, htmlContent);
};
export default sendRefundEmail ;
