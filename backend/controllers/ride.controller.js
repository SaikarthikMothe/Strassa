const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const { sendMessageToSocketId } = require("../socket");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  // 1️⃣ Create ride
  const ride = await rideService.createRide({
    user: req.user._id,
    pickup,
    destination,
    vehicleType,
  });

  // 2️⃣ Get pickup coordinates
  const pickupCoordinates = await mapService.getAddressCoordinates(pickup);

  // 3️⃣ Find nearby captains (increase radius for dev)
  const captainsInRadius = await mapService.getCaptainsIntheRadius(
    pickupCoordinates.lat,
    pickupCoordinates.lng,
    6000
  );

  // 4️⃣ Prepare SAFE user payload
  const userPayload = {
    id: req.user._id,
    name: `${req.user.fullname.firstname} ${req.user.fullname.lastname}`,
    email: req.user.email,
  };

  // 5️⃣ Emit to captains
  captainsInRadius.forEach((captain) => {
    if (!captain.socketId) return;

    console.log("📤 Sending ride to captain:", captain.socketId);

    sendMessageToSocketId(captain.socketId, {
      event: "new-ride-request",
      data: {
        rideId: ride._id,
        pickup: ride.pickup,
        destination: ride.destination,
        fare: ride.fare,
        status: ride.status,
        user: userPayload,
      },
    });
  });

  // 6️⃣ Respond to user
  res.status(201).json({
    success: true,
    rideId: ride._id,
  });
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    res.status(200).json(fare);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captainId: req.captain._id,
    });

    const user = await userModel.findById(ride.user);

    console.log("📡 Emitting ride-confirmed to:", user.socketId);

    sendMessageToSocketId(user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("❌ confirmRide failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId, otp } = req.body;
  try {
    const ride = await rideService.startRide({
      rideId,
      captainId: req.captain._id,
      otp,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error("❌ startRide failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({
      rideId,
      captainId: req.captain._id,
    });

    // USER → payment screen
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-payment-pending",
      data: { rideId: ride._id },
    });

    // CAPTAIN → wait / summary
    sendMessageToSocketId(req.captain.socketId, {
      event: "ride-ended-captain",
      data: { rideId: ride._id },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ endRide failed:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports.getRideById = async (req, res) => {
  try {
    const ride = await rideService.getRideById(req.params.rideId);
    res.status(200).json(ride);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports.payCash = async (req, res) => {
  const { rideId } = req.body;

  const ride = await rideModel.findById(rideId).populate("captain");

  if (!ride) {
    return res.status(404).json({ message: "Ride not found" });
  }

  if (ride.status !== "payment_pending") {
    return res.status(400).json({ message: "Ride is not awaiting payment" });
  }

  // 🔥 THIS WAS MISSING
  ride.status = "paid";

  ride.payment = {
    mode: "CASH",
    status: "SUCCESS",
    amount: ride.fare,
  };

  await ride.save();

  // notify captain
  sendMessageToSocketId(ride.captain.socketId, {
    event: "payment-success",
    data: {
      rideId: ride._id,
      amount: ride.fare,
      mode: "CASH",
    },
  });

  res.status(200).json({ success: true });
};

module.exports.rateCaptain = async (req, res) => {
  const { rideId, rating } = req.body;

  try {
    const ride = await rideModel.findById(rideId);

    if (!ride) throw new Error("Ride not found");
    if (ride.status !== "paid") throw new Error("Ride not completed");
    if (ride.rating?.userToCaptain) throw new Error("Captain already rated");

    ride.rating = {
      userToCaptain: rating,
    };

    await ride.save();

    // update captain rating
    const captain = await Captain.findById(ride.captain);
    captain.totalRatings += 1;
    captain.ratingSum += rating;
    captain.avgRating = captain.ratingSum / captain.totalRatings;

    await captain.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.getUserRideHistory = async (req, res) => {
  try {
    const rides = await rideModel
      .find({
        user: req.user._id,
        status: "paid",
      })
      .populate("captain", "fullname vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getCaptainRideHistory = async (req, res) => {
  try {
    const rides = await rideModel
      .find({
        captain: req.captain._id,
        status: "paid",
      })
      .populate("user", "fullname")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getCaptainEarnings = async (req, res) => {
  try {
    // 1️⃣ Fetch all PAID rides for this captain
    const rides = await rideModel.find({
      captain: req.captain._id,
      status: "paid",
    });

    // 2️⃣ Total earnings (all time)
    const totalEarnings = rides.reduce(
      (sum, ride) => sum + ride.fare,
      0
    );

    // 3️⃣ Total rides
    const totalRides = rides.length;

    // 4️⃣ Today’s earnings (DATE comparison, timezone-safe)
    const now = new Date();

    const todayEarnings = rides
      .filter((ride) => {
        const rideDate = new Date(ride.createdAt);

        return (
          rideDate.getDate() === now.getDate() &&
          rideDate.getMonth() === now.getMonth() &&
          rideDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, ride) => sum + ride.fare, 0);

    // 5️⃣ Send response
    res.status(200).json({
      totalEarnings,
      totalRides,
      todayEarnings,
      rides,
    });
  } catch (error) {
    console.error("Captain earnings error:", error);
    res.status(500).json({
      message: "Failed to fetch captain earnings",
    });
  }
};


