
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.email}`);
    } catch (error) {
        console.error(`Email send failed: ${error.message}`);
        // Don't crash the app if email fails
    }
};

export default sendEmail;
