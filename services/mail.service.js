const transporter = require('../config/mailer.config');
require('dotenv').config();

const sendOtpEmail = async (to, username, otpCode) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; }
                .otp { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; text-align: center; padding: 20px; background: #f9f9f9; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Hello ${username},</h2>
                <p>Thank you for registering. Here is your verification code:</p>
                <div class="otp">${otpCode}</div>
                <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
            </div>
        </body>
        </html>
    `;

    await transporter.sendMail({
        from: `"Tos Louk" <${process.env.SMTP_USER}>`,
        to: to,
        subject: "Your Verification Code",
        html: htmlContent
    })
};

module.exports = {
    sendOtpEmail
}