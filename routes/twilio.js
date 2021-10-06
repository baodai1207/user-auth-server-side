require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendSms = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      messagingServiceSid: 'MG0db5da134702b89bef5f9b2130adc5b2',
      to: phone,
    })
    .then(message => console.log(message.sid))
    .done();
};

module.exports = sendSms;
