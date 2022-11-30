const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
  logLevel: "debug",
});

const sendMessage = async ({ message, contactNumber }) => {
  await client.messages
    .create({
      body: message,
      to: contactNumber,
      from: "+19497870631",
    })
    .then((message) => console.log(message.sid));
};

module.exports = { sendMessage };
