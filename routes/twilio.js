require('dotenv').config();

// const accountSid = 'ACffeac200e9ac5ba9cab338d140677eef;
// const authToken = 'd30dde136c33d5c654b77493ec6f76e1;

const sendSms = (phone, message) => {
  const client = require('twilio')(
    'ACffeac200e9ac5ba9cab338d140677eef',
    'd30dde136c33d5c654b77493ec6f76e1'
  );
  // client.messages
  //   .create({
  //     body: message,
  //     // from: '+13344384113',
  //     messagingServiceSid: 'MG0db5da134702b89bef5f9b2130adc5b2',
  //     to: phone,
  //   })
  //   .then(message => console.log(message.sid))
  //   .done();

  client.messages
    .create({
      body: message,
      messagingServiceSid: 'MG0db5da134702b89bef5f9b2130adc5b2',
      to: phone,
    })
    .then(message => console.log(message.sid))
    .done();
};

module.exports = sendSms;
