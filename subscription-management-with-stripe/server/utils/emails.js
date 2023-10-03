import AWS from 'aws-sdk';
AWS.config.update({ region: 'eu-west-1' });

const SOURCE_EMAIL = process.env.SOURCE_EMAIL;

const SESConfig = {
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY_ID,
};
const ses = new AWS.SES(SESConfig);

const sendActivationEmail = (recipientEmail) => {
  console.log(recipientEmail);
  const params = {
    Destination: {
      //   BccAddresses: [],
      //   CcAddresses: ['recipient3@example.com'],
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Source: SOURCE_EMAIL,
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `You registered successfully! `,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `You registered successfully!`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'ePostersLive',
      },
    },
  };
  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log('Something went wrong with the email sending...');
      console.log(err, err.stack);
    } // an error occurred
    else console.log('Cnfirmation email sent to:', recipientEmail); // successful response
  });
};

export { sendActivationEmail };
