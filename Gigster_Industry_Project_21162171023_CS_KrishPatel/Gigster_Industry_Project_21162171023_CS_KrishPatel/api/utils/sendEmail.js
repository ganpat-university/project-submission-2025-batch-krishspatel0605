import nodemailer from "nodemailer";

const sendEmail = async (to, htmlContent, subject = "Gigster OTP Verification") => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Gigster" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent, // this allows for formatted HTML content
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

export const generateVerificationEmail = (otp, token) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account Verification</title>
</head>
<body>
<h1>Account Verification</h1>
<p>Dear User,</p>
<p>Click on the link below to verify your account:</p>
<a href="${process.env.CLIENT_URL}/verify/${token}">Verify Account</a>
<p>Or enter the OTP below:</p>
<p><strong>${otp}</strong></p>
</body>
</html>`;
};
