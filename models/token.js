const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    null: false
  },
  token: {
    type: String,
  },
  loggedIn: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

TokenSchema.statics.generateToken = async function (userId, expireIn='2 days') {
  const token = await jwt.sign({ payload: { userId: userId } }, process.env.JWT_SECRET, {
    expiresIn: expireIn
  });
  return token;
}

module.exports = mongoose.model("Token", TokenSchema);
