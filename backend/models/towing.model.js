const mongoose = require("mongoose");

const towingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
    },

    // Optional link if towing comes after repair
    parentRepair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RepairRequest",
    },

    pickupLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },

    dropLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },

    quoteAmount: {
      type: Number,
      required: true,
    },

    distanceKm: Number,
    etaMinutes: Number,

    status: {
      type: String,
      enum: [
        "SEARCHING",
        "ASSIGNED",
        "ENROUTE",
        "VEHICLE_LOADED",
        "COMPLETED",
        "PAID",
        "CANCELLED",
      ],
      default: "SEARCHING",
    },

    source: {
      type: String,
      enum: ["DIRECT", "POST_REPAIR"],
      default: "DIRECT",
    },

    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TowingRequest", towingSchema);
