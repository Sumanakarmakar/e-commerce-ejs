const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SENDER_EMAIL, // Admin Gmail ID
    pass: process.env.EMAIL_PASSWORD, // Admin Gmail Password
  },
});

module.exports=transporter
