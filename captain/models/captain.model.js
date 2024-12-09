const mongoose = require("mongoose");

const captainSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("captain", captainSchema);
