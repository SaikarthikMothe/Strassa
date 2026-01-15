const TowingRequest = require("../models/towing.model");
const captainModel = require("../models/captain.model");
const { sendMessageToSocketId } = require("../socket");
const userModel = require("../models/user.model");

/* ----------------------------------------------------
   USER — GET QUOTE (NO DB, NO SOCKET)
---------------------------------------------------- */
exports.getTowingQuote = async (req, res) => {
  const { pickupLocation } = req.body;

  if (!pickupLocation?.lat || !pickupLocation?.lng) {
    return res.status(400).json({ message: "Pickup location required" });
  }

  /**
   * TEMP LOGIC (simple & safe)
   * Later you can:
   * - calculate distance to nearest towing captain
   * - or use Google Maps Distance API
   */
  const baseFare = 300;
  const estimatedDistanceKm = 8; // default / avg
  const perKmRate = 40;

  const estimatedPrice = baseFare + estimatedDistanceKm * perKmRate;
  const etaMinutes = Math.max(10, estimatedDistanceKm * 3);

  res.json({
    estimatedPrice,
    etaMinutes,
    estimatedDistanceKm,
  });
};

/* ----------------------------------------------------
   USER — CREATE TOWING (CONFIRM)
---------------------------------------------------- */
exports.createTowing = async (req, res) => {
  const { pickupLocation, dropLocation, quoteAmount, distanceKm, etaMinutes } =
    req.body;

  const towing = await TowingRequest.create({
    user: req.user._id,
    pickupLocation,
    dropLocation,
    quoteAmount,
    distanceKm,
    etaMinutes,
    status: "SEARCHING",
    source: "DIRECT",
  });

  // 🔔 Notify USER (searching)
  sendMessageToSocketId(req.user.socketId, "towing-searching", {
    towingId: towing._id.toString(),
  });

  console.log("🚛 Creating towing request for user:", req.user._id);
  console.log("👤 User socketId:", req.user.socketId);

  // 🔔 Notify ALL towing captains
  const captains = await captainModel.find({
    status: "active",
  });

  console.log(`🔍 Found ${captains.length} active TOWING captains:`);
  captains.forEach((c, i) => {
    console.log(
      `  ${i + 1}. Captain ${c._id}: socketId=${c.socketId || "NONE"}`
    );
  });

  captains.forEach((captain) => {
    if (captain.socketId) {
      sendMessageToSocketId(captain.socketId, {
        event: "new-towing-request",
        data: {
          towingId: towing._id.toString(),
          pickupLocation,
          dropLocation,
          quoteAmount,
        },
      });
    }
  });

  res.status(201).json(towing);
};

/* ----------------------------------------------------
   USER — CANCEL TOWING
---------------------------------------------------- */
exports.cancelTowing = async (req, res) => {
  const { towingId } = req.body;

  const towing = await TowingRequest.findById(towingId).populate("captain");

  if (!towing) {
    return res.status(404).json({ message: "Towing not found" });
  }

  if (!["SEARCHING", "ASSIGNED"].includes(towing.status)) {
    return res.status(400).json({ message: "Cannot cancel now" });
  }

  towing.status = "CANCELLED";
  await towing.save();

  // 🔔 Notify captain if assigned
  if (towing.captain?.socketId) {
    sendMessageToSocketId(towing.captain.socketId, "towing-cancelled", {
      towingId,
    });
  }

  res.json({ message: "Towing cancelled" });
};

/* ----------------------------------------------------
   CAPTAIN — ACCEPT TOWING
---------------------------------------------------- */
exports.acceptTowing = async (req, res) => {
  const { towingId } = req.body;

  if (!req.captain) {
    return res.status(401).json({ message: "Captain not authenticated" });
  }

  const towing = await TowingRequest.findById(towingId).populate("user");

  if (!towing || towing.status !== "SEARCHING") {
    return res.status(400).json({ message: "Towing not available" });
  }

  towing.captain = req.captain._id;
  towing.status = "ASSIGNED";
  await towing.save();

  // 🔔 Notify USER
  sendMessageToSocketId(towing.user.socketId, {
    event: "towing-assigned",
    data: {
      towingId: towing._id.toString(),
      captain: {
        id: req.captain._id,
        name: req.captain.fullname,
        vehicle: req.captain.vehicle,
      },
    },
  });

  res.json(towing);
};

/* ----------------------------------------------------
   CAPTAIN — REJECT TOWING (EXPLICIT)
---------------------------------------------------- */
exports.rejectTowing = async (req, res) => {
  // No state change — rejection is passive
  res.json({ message: "Towing rejected" });
};

/* ----------------------------------------------------
   CAPTAIN — UPDATE STATUS
---------------------------------------------------- */
exports.updateTowingStatus = async (req, res) => {
  const { towingId, status } = req.body;

  const allowed = ["ENROUTE", "VEHICLE_LOADED", "COMPLETED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // populate user so we get socketId
  const towing = await TowingRequest
    .findById(towingId)
    .populate("user");

  if (!towing) {
    return res.status(404).json({ message: "Towing not found" });
  }

  towing.status = status;
  await towing.save();

  // 🔔 SOCKET → USER (REAL-TIME STATUS UPDATE)
  if (towing.user?.socketId) {
    sendMessageToSocketId(towing.user.socketId, {
      event: "towing-status-update",
      data: {
        towingId: towing._id.toString(),
        status,
      },
    });
  }

  res.json(towing);
};


/* ----------------------------------------------------
   USER — PAYMENT
---------------------------------------------------- */
exports.payForTowing = async (req, res) => {
  const { towingId } = req.body;

  const towing = await TowingRequest.findById(towingId);
  if (!towing || towing.status !== "COMPLETED") {
    return res.status(400).json({ message: "Towing not completed" });
  }

  towing.status = "PAID";
  towing.paidAt = new Date();
  await towing.save();

  res.json({ message: "Payment successful" });
};
