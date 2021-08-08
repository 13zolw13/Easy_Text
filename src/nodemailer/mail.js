const nodemailer = require('nodemailer');
const transport = require("nodemailer-smtp-transport");


let transporter = nodemailer.createTransport(
        transport({
          service: "gmail",
          host: "smtp.gmail.com",
          secure: true, // use SSL
          auth: {
            user: "noreply.easytext@gmail.com",
            pass: process.env.GOOGLE_MAIL_PASS,
          },
        })
      );

      
module.exports = { transporter };