const repairService = require("../services/repair.service");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const { sendMessageToSocketId } = require("../socket");
const RepairRequest = require("../models/repair.model");

/* ---------- CREATE ---------- */
exports.create = async (req, res) => {
  try {
    const repair = await repairService.create({
      userId: req.user._id,
      ...req.body,
    });

    const captains = await captainModel.find({ status: "active" });

    captains.forEach((c) => {
      if (c.socketId) {
        sendMessageToSocketId(c.socketId, {
          event: "new-job-request",
          data: {
            jobType: "REPAIR",
            jobId: repair._id.toString(),
            payload: repair,
          },
        });
      }
    });

    res.status(201).json(repair);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------- ACCEPT ---------- */
exports.accept = async (req, res) => {
  try {
    const { repairId } = req.body;

    const repair = await RepairRequest.findById(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // 🔒 race-condition lock
    if (repair.status !== "PENDING") {
      return res.status(400).json({ message: "Repair already taken" });
    }

    repair.captain = req.captain._id;
    repair.status = "ASSIGNED";
    await repair.save();

    // get user socketId
    const user = await userModel.findById(repair.user);
    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "repair-assigned",
        data: {
          repairId: repair._id.toString(),
        },
      });
    }

    // Log for debugging (remove the io.sockets part that causes error)
    console.log("🔍 DEBUG - User socket check:");
    console.log("User ID:", user._id);
    console.log("User socketId from DB:", user?.socketId);
    console.log("Repair ID:", repair._id.toString());

    res.json({
      success: true,
      repairId: repair._id,
    });
  } catch (err) {
    console.error("❌ accept error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/* ---------- ENROUTE ---------- */
exports.enroute = async (req, res) => {
  try {
    const { repairId } = req.body;

    if (!repairId) {
      return res.status(400).json({ message: "repairId is required" });
    }

    const repair = await RepairRequest.findById(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // Allow ENROUTE from ASSIGNED, but don't error if already ENROUTE
    if (repair.status === "ENROUTE") {
      return res.json({
        success: true,
        message: "Already enroute",
        status: repair.status,
      });
    }

    if (repair.status !== "ASSIGNED") {
      return res.status(400).json({
        message: `Cannot mark ENROUTE from ${repair.status}`,
      });
    }

    repair.status = "ENROUTE";
    await repair.save();

    res.json({
      success: true,
      status: repair.status,
    });
  } catch (err) {
    console.error("❌ enroute error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.Cancel = async (req, res) => {
  try {
    const { repairRequestId } = req.body;

    const repair = await RepairRequest.findById(repairRequestId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // Check if can be cancelled (only PENDING or ASSIGNED or ENROUTE)
    if (["PENDING", "ASSIGNED", "ENROUTE"].includes(repair.status)) {
      repair.status = "REJECTED";
      await repair.save();

      // Notify captain if assigned
      if (repair.captain) {
        const captain = await captainModel.findById(repair.captain);
        if (captain?.socketId) {
          sendMessageToSocketId(captain.socketId, {
            event: "repair-cancelled",
            data: { repairId: repair._id.toString() },
          });
        }
      }

      res.json({ success: true, message: "Repair request cancelled" });
    } else {
      res
        .status(400)
        .json({ message: "Cannot cancel repair in current status" });
    }
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/*------------ DIAGNOSE ------------------*/
exports.markDiagnosed = async (req, res) => {
  try {
    console.log("📥 Received diagnose request:", req.body);
    const { repairId, diagnosis, pricing } = req.body;

    if (!repairId || !diagnosis || !pricing) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const repair = await RepairRequest.findById(repairId);
    console.log("🔍 Found repair:", repair?._id);

    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // 🔒 STATUS GUARD
    if (repair.status !== "ENROUTE") {
      console.log(`❌ Invalid status: ${repair.status}, expected ENROUTE`);
      return res.status(400).json({
        message: `Cannot diagnose from status ${repair.status}`,
      });
    }

    // ✅ SAVE DIAGNOSIS
    repair.diagnosis = {
      note: diagnosis,
      pricing: {
        inspection: pricing.inspection,
        labor: pricing.labor,
        parts: pricing.parts || 0,
        total: pricing.total,
      },
    };

    // ✅ UPDATE STATUS
    repair.status = "DIAGNOSED";
    await repair.save();

    console.log("✅ Repair saved with status:", repair.status);
    console.log("👤 Repair user ID:", repair.user);

    // 🔔 SOCKET EVENT
    const user = await userModel.findById(repair.user);
    console.log("🔍 User found:", user?._id);
    console.log("📡 User socketId:", user?.socketId);

    // Check if we have the sendMessageToSocketId function
    console.log(
      "🔧 sendMessageToSocketId function:",
      typeof sendMessageToSocketId
    );

    if (user?.socketId) {
      try {
        sendMessageToSocketId(user.socketId, {
          event: "repair-diagnosed",
          data: {
            repairId: repair._id.toString(),
            diagnosis: repair.diagnosis,
            status: repair.status,
          },
        });
        console.log("✅ Socket event sent to user");
      } catch (socketErr) {
        console.error("❌ Error sending socket event:", socketErr);
      }
    } else {
      console.log("❌ No socketId found for user");

      // Try to get user's socket from global io instance
      try {
        const io = req.app.get("io");
        if (io) {
          console.log("🔄 Trying global io instance...");
          // Get all connected sockets
          const sockets = await io.fetchSockets();
          console.log("Total connected sockets:", sockets.length);

          // Try to find user's socket by user ID room
          io.to(repair.user.toString()).emit("repair-diagnosed", {
            repairId: repair._id.toString(),
            diagnosis: repair.diagnosis,
            status: repair.status,
          });
          console.log("✅ Emitted to user room");
        } else {
          console.log("❌ No io instance available");
        }
      } catch (ioErr) {
        console.error("❌ Error with io instance:", ioErr);
      }
    }

    return res.status(200).json({
      message: "Diagnosis submitted successfully",
      repair,
    });
  } catch (err) {
    console.error("❌ submitDiagnosis error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// In repair.controller.js
exports.testSocket = async (req, res) => {
  try {
    const { repairId, userId } = req.body;

    console.log("🧪 Test socket endpoint called");
    console.log("Repair ID:", repairId);
    console.log("User ID:", userId);

    // Get user
    const user = await userModel.findById(userId);
    console.log("User found:", user?._id);
    console.log("User socketId:", user?.socketId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Test data
    const testData = {
      repairId: repairId,
      diagnosis: {
        note: "Test diagnosis - This is a test",
        pricing: {
          inspection: 100,
          labor: 200,
          parts: 300,
          total: 600,
        },
      },
      status: "DIAGNOSED",
    };

    // Try sendMessageToSocketId
    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "repair-diagnosed",
        data: testData,
      });
      console.log("✅ Test event sent via sendMessageToSocketId");
    }

    // Try io instance
    try {
      const io = req.app.get("io");
      if (io) {
        // Emit to user's room
        io.to(userId).emit("repair-diagnosed", testData);
        console.log("✅ Test event sent via io.to(userId)");

        // Also try broadcasting
        io.emit("repair-diagnosed-broadcast", {
          message: "Test broadcast",
          userId,
          socketId: user?.socketId,
        });
        console.log("✅ Test broadcast sent");
      }
    } catch (ioErr) {
      console.log("No io instance:", ioErr.message);
    }

    res.json({
      success: true,
      message: "Test socket event sent",
      userSocketId: user?.socketId,
      userId: user._id,
    });
  } catch (err) {
    console.error("Test socket error:", err);
    res.status(500).json({ message: "Test failed", error: err.message });
  }
};

/*---------------APPROVE-----------------*/
// In repair.controller.js - update the approve function:
exports.approve = async (req, res) => {
  try {
    const { repairRequestId } = req.body;

    if (!repairRequestId) {
      return res.status(400).json({ message: "repairRequestId is required" });
    }

    const repair = await RepairRequest.findById(repairRequestId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // 🔒 State guard
    if (repair.status !== "DIAGNOSED") {
      return res.status(400).json({
        message: `Cannot approve from status ${repair.status}`,
      });
    }

    repair.status = "APPROVED";
    await repair.save();

    // 🔔 CRITICAL FIX: Notify captain via socket
    if (repair.captain) {
      const captain = await captainModel.findById(repair.captain);
      if (captain?.socketId) {
        console.log(`📢 Sending repair-approved to captain ${captain._id}`);
        sendMessageToSocketId(captain.socketId, {
          event: "repair-approved",
          data: {
            repairId: repair._id.toString(),
            status: "APPROVED",
          },
        });
      } else {
        console.log(`❌ Captain ${repair.captain} has no socketId`);
      }
    }

    res.json({
      success: true,
      message: "Repair approved",
      repair,
    });
  } catch (err) {
    console.error("❌ approve error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/*---------------REJECT------------------*/
exports.reject = async (req, res) => {
  try {
    const { repairRequestId } = req.body;

    if (!repairRequestId) {
      return res.status(400).json({ message: "repairRequestId is required" });
    }

    const repair = await RepairRequest.findById(repairRequestId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // 🔒 State guard
    if (repair.status !== "DIAGNOSED") {
      return res.status(400).json({
        message: `Cannot reject from status ${repair.status}`,
      });
    }

    // 💰 inspection-only charge
    const inspectionFee = repair.diagnosis?.pricing?.inspection || 0;

    repair.status = "REJECTED";
    repair.rejectionCharge = inspectionFee;
    await repair.save();

    // 🔔 Notify captain
    if (repair.captain) {
      const captain = await captainModel.findById(repair.captain);
      if (captain?.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "repair-rejected",
          data: {
            repairId: repair._id.toString(),
            inspectionFee,
          },
        });
      }
    }

    res.json({
      success: true,
      message: "Repair rejected",
      inspectionFee,
    });
  } catch (err) {
    console.error("❌ reject error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------- QUOTE ---------- */
exports.sendQuote = async (req, res) => {
  try {
    const { repairId, diagnosis, amount } = req.body;

    if (!repairId || !diagnosis || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const repair = await RepairRequest.findById(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    if (repair.status !== "DIAGNOSED") {
      return res.status(400).json({
        message: `Cannot quote from status ${repair.status}`,
      });
    }

    repair.diagnosis = diagnosis;
    repair.quoteAmount = amount;
    repair.status = "QUOTED";
    await repair.save();

    // 🔔 notify user
    const user = await userModel.findById(repair.user);
    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "repair-updated",
        data: {
          repairId: repair._id.toString(),
          status: "QUOTED",
        },
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ sendQuote error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/*------------ACTIVE REPAIR STATUS--------*/
exports.getActiveRepairForCaptain = async (req, res) => {
  console.log("🔥 getActiveRepairForCaptain HIT");
  console.log("Captain ID:", req.captain?._id);
  try {
    const repair = await RepairRequest.findOne({
      captain: req.captain._id,
      status: "APPROVED",
    }).sort({ updatedAt: -1 });

    if (!repair) {
      return res.json(null);
    }

    res.json(repair);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch active repair" });
  }
};

/* ---------- FIXED ---------- */
exports.completeRepair = async (req, res) => {
  const { repairId } = req.body;

  const repair = await RepairRequest.findById(repairId);
  if (!repair) return res.status(404).json({ message: "Repair not found" });

  if (repair.status !== "APPROVED") {
    return res.status(400).json({
      message: `Cannot complete from ${repair.status}`,
    });
  }

  repair.status = "COMPLETED";
  await repair.save();

  const user = await userModel.findById(repair.user);
  if (user?.socketId) {
    sendMessageToSocketId(user.socketId, {
      event: "repair-outcome",
      data: {
        repairId: repair._id.toString(),
        status: "COMPLETED",
      },
    });
  }

  res.json({ success: true });
};

/* ---------- NOT FIXABLE ---------- */
exports.markNotFixable = async (req, res) => {
  try {
    const { repairId, reason, partAttempted, partInstalled } = req.body;

    if (!repairId || !reason) {
      return res.status(400).json({
        message: "repairId and reason are required",
      });
    }

    const repair = await RepairRequest.findById(repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    // 🔒 STATE GUARD
    if (repair.status !== "APPROVED") {
      return res.status(400).json({
        message: `Cannot mark not-fixable from ${repair.status}`,
      });
    }

    // 🧮 PRICING LOGIC
    const inspectionFee = repair.diagnosis?.pricing?.inspection || 0;
    const partsCost = repair.diagnosis?.pricing?.parts || 0;

    let finalAmount = inspectionFee;

    if (partAttempted && partInstalled) {
      finalAmount += partsCost;
    }

    // ✅ UPDATE REPAIR
    repair.status = "NOT_FIXABLE";
    repair.outcome = "NOT_FIXABLE";
    repair.nonFixableReason = reason;
    repair.partAttempted = partAttempted;
    repair.partInstalled = partInstalled;
    repair.finalAmount = finalAmount;
    repair.closedAt = new Date();

    await repair.save();

    // 🔔 NOTIFY USER
    const user = await userModel.findById(repair.user);
    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "repair-payment-required",
        data: {
          repairId: repair._id.toString(),
          amount: finalAmount,
          outcome: "NOT_FIXABLE",
        },
      });
    }

    res.json({
      success: true,
      repair,
    });
  } catch (err) {
    console.error("❌ markNotFixable error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


/* ---------- OFFER TOWING ---------- */
exports.offerTowing = async (req, res) => {
  const repair = await repairService.offerTowing({
    repairRequestId: req.body.repairRequestId,
    towingPrice: req.body.towingPrice,
  });

  res.json(repair);
};

/* ---------- PAY ---------- */
exports.pay = async (req, res) => {
  const repair = await repairService.pay(req.body.repairRequestId);
  res.json(repair);
};

/* ---------- RATE ---------- */
exports.rate = async (req, res) => {
  const repair = await repairService.rate({
    repairRequestId: req.body.repairRequestId,
    rating: req.body.rating,
  });

  res.json(repair);
};

exports.getById = async (req, res) => {
  try {
    const repair = await RepairRequest.findById(
      req.params.repairRequestId
    ).populate("captain", "fullname vehicle");

    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    res.json(repair);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

