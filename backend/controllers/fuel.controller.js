const fuelService = require("../services/fuel.service");
const captainModel = require("../models/captain.model");
const userModel = require("../models/user.model");
const FuelRequest = require("../models/fuelRequest.model");
const { sendMessageToSocketId } = require("../socket");
const axios = require("axios");

const getAddressFromLatLng = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "uber-fuel-app" },
  });

  return res.data.display_name;
};

/* USER CREATES */
exports.create = async (req, res) => {
  try {
    const fuel = await fuelService.createFuel({
      userId: req.user._id,
      fuelType: req.body.fuelType,
      quantity: req.body.quantity,
      location: req.body.location,
    });

    const captains = await captainModel.find({ status: "active" });

    const address = await getAddressFromLatLng(
      fuel.location.lat,
      fuel.location.lng
    );
    captains.forEach((c) => {
      if (c.socketId) {
        sendMessageToSocketId(c.socketId, {
          event: "new-fuel-request",
          data: {
            fuelRequestId: fuel._id.toString(),
            fuelType: fuel.fuelType,
            quantity: fuel.quantity,
            totalAmount: fuel.totalAmount,
            location: fuel.location,
            address, // 👈 ADD THIS
          },
        });
      }
    });

    res.status(201).json(fuel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* CAPTAIN ACCEPTS */
exports.accept = async (req, res) => {
  try {
    const fuel = await fuelService.acceptFuel({
      fuelRequestId: req.body.fuelRequestId,
      captainId: req.captain._id,
    });

    const user = await userModel.findById(fuel.user);

    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "fuel-accepted",
        data: { fuelRequestId: fuel._id.toString() },
      });
    }

    res.json(fuel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* CAPTAIN DELIVERS */
exports.deliver = async (req, res) => {
  try {
    const fuel = await fuelService.deliverFuel({
      fuelRequestId: req.body.fuelRequestId,
    });

    const user = await userModel.findById(fuel.user);

    if (user?.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "fuel-delivered",
        data: { fuelRequestId: fuel._id.toString() },
      });
    }

    res.json(fuel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* USER PAYMENT */
exports.payCash = async (req, res) => {
  try {
    const fuel = await fuelService.payCash({
      fuelRequestId: req.body.fuelRequestId,
    });
    res.json(fuel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* GET DETAILS */
exports.getById = async (req, res) => {
  const fuel = await FuelRequest.findById(req.params.fuelRequestId);
  res.json(fuel);
};
