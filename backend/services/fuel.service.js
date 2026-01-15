const FuelRequest = require("../models/fuelRequest.model");

const PRICE = {
  PETROL: 110,
  DIESEL: 95,
};

exports.createFuel = async ({ userId, fuelType, quantity, location }) => {
  if (!fuelType || !quantity || !location) {
    throw new Error("Missing fields");
  }

  const pricePerLiter = PRICE[fuelType];
  const totalAmount = pricePerLiter * quantity;

  return FuelRequest.create({
    user: userId,
    fuelType,
    quantity,
    pricePerLiter,
    totalAmount,
    location,
  });
};

exports.acceptFuel = async ({ fuelRequestId, captainId }) => {
  const fuel = await FuelRequest.findById(fuelRequestId);
  if (!fuel || fuel.status !== "PENDING") {
    throw new Error("Fuel request not available");
  }

  fuel.captain = captainId;
  fuel.status = "ACCEPTED";
  return fuel.save();
};

exports.deliverFuel = async ({ fuelRequestId }) => {
  const fuel = await FuelRequest.findById(fuelRequestId);
  if (!fuel || fuel.status !== "ACCEPTED") {
    throw new Error("Fuel not deliverable");
  }

  fuel.status = "DELIVERED";
  return fuel.save();
};

exports.payCash = async ({ fuelRequestId }) => {
  const fuel = await FuelRequest.findById(fuelRequestId);
  if (!fuel || fuel.status !== "DELIVERED") {
    throw new Error("Payment not allowed");
  }

  fuel.status = "PAID";
  return fuel.save();
};
