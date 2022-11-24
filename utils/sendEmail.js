const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {
  // let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig)

  // message = {
  //   from: "from@email.com",
  //   to: "to@email.com",
  //   subject: "Subject",
  //   html: "<h1>Hello SMTP Email From VRosliy</h1>"
  // }

  return transporter.sendMail({
    from: "from@email.com",
    to,
    subject,
    html,
  });
};


// async function sendEmail({ to, subject, html }) {
//   let testAccount = await nodemailer.createTestAccount();

//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass, 
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"Власні 👻" <vlasnifinansy@gmail.com>',
//     to,
//     subject,
//     html,
//   });
//   return info
// }

module.exports = sendEmail;