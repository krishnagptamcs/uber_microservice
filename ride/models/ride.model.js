const mongoose = require("mongoose");
const { type } = require("os");

const rideSchema = new mongoose.Schema(
  {
    captain: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    pickup: {
      type: String,
      require: true,
    },
    destination: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "started", "completed"],
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("rides", rideSchema);
