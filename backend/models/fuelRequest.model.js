const mongoose = require("mongoose");

const fuelRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
      default: null,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    fuelType: {
      type: String,
      enum: ["PETROL", "DIESEL"],
      required: true,
      default: "PETROL",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    pricePerLiter: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DELIVERED", "PAID"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("fuelRequest", fuelRequestSchema);
