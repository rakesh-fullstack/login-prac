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
      html: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error, "Email not sent");
  }
};

module.exports = { sendMail };
