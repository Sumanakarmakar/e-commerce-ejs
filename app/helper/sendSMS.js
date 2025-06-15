const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PNF = require("google-libphonenumber").PhoneNumberFormat;
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const validateAndFormatPhoneNumber = (phoneNumber) => {
  try {
    const number = phoneUtil.parse(phoneNumber, "IN");
    
    if (phoneUtil.isValidNumber(number)) {
      return phoneUtil.format(number, PNF.E164); // Format number to E.164 format
    } else {
      throw new Error("Invalid user phone number");
    }
  } catch (error) {
    throw new Error("Invalid phone number");
  }
};

const sendSMS = async (user, body) => {
  const formattedPhone = validateAndFormatPhoneNumber(user.phone); // Format phone number here
  let msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: formattedPhone,
    body,
  };
  try {
    const message = await client.messages.create(msgOptions);
    // console.log("msg", message.body);
  } catch (error) {
    console.log(`Error in sending msg notifications ${error}`);
  }
};

module.exports = sendSMS;
