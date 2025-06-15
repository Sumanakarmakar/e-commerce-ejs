const transporter = require("../config/emailConfig");

const sendEmailVerificationRegister = async (req, user, token) => {
  const verificationLink = `${req.protocol}://${req.headers.host}/confirmation/${
    user.email
  }/${token}`;
  // console.log("resetLink", verificationLink);
  //console.log("resetLink", transporter);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Account Verification",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
  <h2 style="color: #333;">Hello ${user.name},</h2>
  <p style="color: #555; font-size: 16px;">
    Thank you for registering with <strong>Our Adminstrator</strong>. To complete your registration, please verify your account by clicking the button below:
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${verificationLink}" 
       style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
       Verify Account
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    Or copy and paste this link into your browser:
  </p>
  <p style="word-wrap: break-word; color: #555;">
    ${verificationLink}
  </p>
  <p style="color: #555; font-size: 14px;">
    If you didn’t create an account with us, please ignore this email.
  </p>
  <p style="color: #333; font-size: 16px;">
    Thank you,<br/>
    <strong>Nodejs</strong> Team
  </p>
  <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
  <p style="color: #999; font-size: 12px; text-align: center;">
    This is an automated message, please do not reply to this email.
  </p>
  </div>`,
  });
  return verificationLink;
};

const sendEjsEmailVerificationForgotPW = async (req, user, token) => {
  const resetLink = `${req.protocol}://${req.headers.host}/admin/reset_password/${user.email}/${token}`;
  // console.log("resetLink", resetLink);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password Reset Link",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
  <h2 style="color: #333;">Hello ${user.name},</h2>
  <p style="color: #555; font-size: 16px;">
    Thank you for registering with <strong>Our Adminstrator</strong>. To complete your registration, please verify your account by clicking the button below:
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetLink}" 
       style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
       Verify Account
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    Or copy and paste this link into your browser:
  </p>
  <p style="word-wrap: break-word; color: #555;">
    ${resetLink}
  </p>
  <p style="color: #555; font-size: 14px;">
    If you didn’t create an account with us, please ignore this email.
  </p>
  <p style="color: #333; font-size: 16px;">
    Thank you,<br/>
    <strong>Nodejs</strong> Team
  </p>
  <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
  <p style="color: #999; font-size: 12px; text-align: center;">
    This is an automated message, please do not reply to this email.
  </p>
  </div>`,
  });
  return resetLink;
};

module.exports = { sendEmailVerificationRegister, sendEjsEmailVerificationForgotPW };
