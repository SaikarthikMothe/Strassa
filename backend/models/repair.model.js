const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
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

    issue: String,
    notes: String,

    vehicleType: String,
    make: String,
    model: String,
    vehicleNumber: String,

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    quotedPrice: Number,

    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "ENROUTE",
        "DIAGNOSED",
        "QUOTED",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
        "NOT_FIXABLE",
        "TOWING_OFFERED",
        "CLOSED",
        "PAID",
      ],
      default: "PENDING",
    },
    diagnosis: {
      note: String,
      pricing: {
        inspection: Number,
        labor: Number,
        parts: Number,
        total: Number,
      },
    },
    partAttempted: {
      type: Boolean,
      default: false,
    },

    partInstalled: {
      type: Boolean,
      default: false,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    quoteAmount: {
      type: Number,
    },

    outcome: {
      type: String,
      enum: ["FIXED", "NOT_FIXABLE", "CANCELLED"],
    },

    nonFixableReason: {
      type: String,
    },

    closedAt: {
      type: Date,
    },
    towingRequired: {
      type: Boolean,
      default: false,
    },

    towingQuote: Number,

    rating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepairRequest", repairRequestSchema);
