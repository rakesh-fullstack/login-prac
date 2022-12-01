const twilio = require("twilio");

console.log(process.env.TWILIO_ACCOUNT_SID);
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
  logLevel: "debug",
});

const sendMessage = async ({ message, contactNumber }) => {
  await client.messages
    .create({
      body: message,
      to: contactNumber,
      from: process.env.TWILIO_PHONE_NUM,
    })
    .then((message) => console.log(message.sid));
};

module.exports = { sendMessage };
