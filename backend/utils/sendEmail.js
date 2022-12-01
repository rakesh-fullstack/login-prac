const nodemailer = require("nodemailer");
require("dotenv").config();

const Transport = require("nodemailer-sendinblue-transport");

const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport(
      new Transport({
        apiKey: process.env.EMAIL_API_KEY,
      })
    );

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: getEmailVerificationEmailTemplate(options.otp),
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error, "Email not sent");
  }
};

const getEmailVerificationEmailTemplate = (code) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style>
@media only screen and (max-width: 620px) {
    h1 {
        font-size: 20px;
        padding: 5px;
    }
}
</style>
</head>
<body>
    <div>
        <div style="max-width: 620px; margin: 0 auto; font-family: san-serif; color: #272727;">
            <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727">Welcome to Visual Path</h1>
            <p style="text-align: center">Please verify your email with the verification code: </p>
            <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center; background: #f6f6f6; border-radius:5px; font-size: 25px; letter-spacing: 0.1em">${code}</p>
        </div>
    </div>
</body>
</html> 
    `;
};

module.exports = { sendMail };
