import { createTransport } from 'nodemailer';

var transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASWORD_MAIL
  }
});

export const sendMail = (from, to, subject, text) => {
    const mailOptions = {
        from,
        to,
        subject,
        text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('Email sent: ' + info.response);
          return true;
        }
      });
};