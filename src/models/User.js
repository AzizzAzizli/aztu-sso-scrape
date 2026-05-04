const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true, 
  },
  uniId: {
    type: String,
    required: true,
  },
  passwordEncrypted: {
    type: String,
    required: true,
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
