const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "ongoing",
        "payment_pending",
        "paid",
        "cancelled",
      ],
      default: "pending",
    },

    duration: Number,
    distance: Number,

    paymentID: String,
    orderID: String,
    signature: String,

    otp: {
      type: String,
      select: false,
      required: true,
    },

    payment: {
      mode: { type: String, enum: ["ONLINE", "CASH"] },
      status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"] },
      amount: Number,
    },

    rating: {
      userToCaptain: { type: Number, min: 1, max: 5 },
      captainToUser: { type: Number, min: 1, max: 5 },
    },
  },
  {
    timestamps: true, // ✅ CORRECT PLACE
  }
);

module.exports = mongoose.model("ride", rideSchema);
