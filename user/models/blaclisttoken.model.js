const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // Expire in 1 hr this key is use to remove the entry from DB
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blackListToken", blacklistTokenSchema);
