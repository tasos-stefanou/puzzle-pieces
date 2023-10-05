import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

AWS.config.update({ region: 'eu-west-1' });

const SOURCE_EMAIL = process.env.SOURCE_EMAIL;

const SESConfig = {
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY_ID,
};
const ses = new AWS.SES(SESConfig);

const sendActivationEmail = (recipientEmail, activationToken) => {
  console.log(recipientEmail, activationToken);
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
          //   TODO: make that env var
          Data: `Thank you for signing up. Please follow the link to <a class="ulink" href="http://localhost:3000/activate/${activationToken}" target="_blank">activate your account</a>.`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Thank you for signing up. Please follow the link to activate your account http://localhost:3000/activate/${activationToken} .`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Full Auth App - Activate your account.',
      },
    },
  };
  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log('Something went wrong with the email sending...');
      console.log(err, err.stack);
    } // an error occurred
    else console.log('Activation email sent to:', recipientEmail); // successful response
  });
};
const sendResetPasswordEmail = (recipientEmail, resetPasswordToken) => {
  console.log(recipientEmail, resetPasswordToken);
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
          //   TODO: make that env var
          Data: `Click  to <a class="ulink" href="http://localhost:3000/reset-password/${resetPasswordToken}" target="_blank">reset your password</a>.`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Click to reset your password. http://localhost:3000/reset-password/${resetPasswordToken} .`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Full Auth App - Reset your account password.',
      },
    },
  };
  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log('Something went wrong with the email sending...');
      console.log(err, err.stack);
    } // an error occurred
    else console.log('Reset password email sent to:', recipientEmail); // successful response
  });
};

const sendPasswordlessLoginEmail = (recipientEmail, passwordlessLoginToken) => {
  console.log(recipientEmail, passwordlessLoginToken);
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
          //   TODO: make that env var
          Data: `Click  to <a class="ulink" href="http://localhost:3000/login-with-magic-link/${passwordlessLoginToken}" target="_blank">login</a>.`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Click to login. http://localhost:3000/login-with-magic-link/${passwordlessLoginToken} .`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Full Auth App - Login to your account.',
      },
    },
  };
  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log('Something went wrong with the email sending...');
      console.log(err, err.stack);
    } // an error occurred
    else console.log('Magic link email sent to:', recipientEmail); // successful response
  });
};

export { sendActivationEmail, sendResetPasswordEmail, sendPasswordlessLoginEmail };
