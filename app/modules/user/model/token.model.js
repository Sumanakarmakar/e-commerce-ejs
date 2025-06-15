const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  token: {
    type: String,
  },
  expiredAt: {
    type: Date,
    default: Date.now(),
    index: {
      expires: 300,
    },
  },
});

const TokenModel = mongoose.model("token", tokenSchema);

module.exports = TokenModel;
