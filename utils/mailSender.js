import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });


        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("📧 Email response:", info);

        console.log("✅ Email sent:", info.response);


    } catch (error) {
        console.log(process.env.MAIL_PASSWORD);
        console.log(process.env.MAIL_USER);
        console.log("❌ Email error:", error);
    }
}


