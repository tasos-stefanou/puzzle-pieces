import AWS from 'aws-sdk';
AWS.config.update({ region: 'eu-west-1' });

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
    Source: 'dev@scigentech.com',
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

// const sendResetPasswordEmail = (recipientEmail, resetPasswordToken) => {
//   console.log(recipientEmail, resetPasswordToken);
//   const params = {
//     Destination: {
//       //   BccAddresses: [],
//       //   CcAddresses: ['recipient3@example.com'],
//       ToAddresses: [recipientEmail],
//     },
//     ReplyToAddresses: [],
//     Source: 'dev@scigentech.com',
//     Message: {
//       Body: {
//         Html: {
//           Charset: 'UTF-8',
//           Data: `Click  to <a class="ulink" href="${process.env.WEB_APP_URL_FRONT}/reset-password/${resetPasswordToken}" target="_blank">reset your password</a>.`,
//         },
//         Text: {
//           Charset: 'UTF-8',
//           Data: `Click to reset your password ${process.env.WEB_APP_URL_FRONT}/reset-password/${resetPasswordToken}.`,
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: 'Scigen Technologies - Reset your ePostersLive account password.',
//       },
//     },
//   };
//   ses.sendEmail(params, function (err, data) {
//     if (err) {
//       console.log('Something went wrong with the email sending...');
//       console.log(err, err.stack);
//     } // an error occurred
//     else console.log('Reset password email sent to:', recipientEmail); // successful response
//   });
// };
// const sendAlarmEmail = (message) => {
//   const params = {
//     Destination: {
//       //   BccAddresses: [],
//       //   CcAddresses: ['recipient3@example.com'],
//       ToAddresses: [process.env.ALARM_RECEIVER_EMAIL],
//     },
//     ReplyToAddresses: [],
//     Source: 'epl2portal@scigentech.com',
//     Message: {
//       Body: {
//         Html: {
//           Charset: 'UTF-8',
//           Data: `${message}`,
//         },
//         Text: {
//           Charset: 'UTF-8',
//           Data: `${message}`,
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: 'Alarm - ePostersLive v2 Portal!!!',
//       },
//     },
//   };
//   ses.sendEmail(params, function (err, data) {
//     if (err) {
//       console.log('Something went wrong with the alarm email sending...');
//       console.log(err, err.stack);
//     } // an error occurred
//     else console.log('Email was sent to admin'); // successful response
//   });
// };

export { sendActivationEmail };
