const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
    await mongoose.connect(URI);
    console.log(`Successfully Connected to MongoDB`);
  } catch (err) {
    console.log(`Error in MongoDB`);
  }
};

module.exports = connectDB;
