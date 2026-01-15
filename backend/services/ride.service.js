const rideModel = require("../models/ride.model");
const mapService = require("./maps.service");
const crypto = require("crypto");
function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1)
      .toString();
    return otp;
  }
  return generateOtp(num);
}
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and Destination are required");
  }

  const distanceTime = await mapService.getDistanceAndTime(pickup, destination);

  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    auto: 6,
    car: 8,
    motorcycle: 4,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  const distance = distanceTime.distance.value / 1000;
  const duration = distanceTime.duration.value / 60;

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinuteRate.car
    ),
    motorcycle: Math.round(
      baseFare.motorcycle +
        (distanceTime.distance.value / 1000) * perKmRate.motorcycle +
        (distanceTime.duration.value / 60) * perMinuteRate.motorcycle
    ),
  };
  return fare;
}
module.exports.getFare = getFare;
module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("User, Pickup, Destination, and Vehicle Type are required");
  }
  const fare = await getFare(pickup, destination);
  const otp = getOtp(6);
  console.log(fare);
  console.log(otp);
  const ride = new rideModel({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });
  await ride.save();

  return ride;
};
module.exports.confirmRide = async ({ rideId, captainId }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  // 1️⃣ Update ride WITHOUT populate
  await rideModel.findByIdAndUpdate(
    rideId,
    {
      status: "accepted",
      captain: captainId,
    },
    { new: true }
  );

  // 2️⃣ Fetch again WITH populate
  const populatedRide = await rideModel
    .findById(rideId)
    .populate("captain")
    .select("+otp");

  return populatedRide;
};

module.exports.startRide = async ({ rideId, otp, captainId }) => {
  if (!rideId || !otp) {
    throw new Error("Ride ID and otp is required");
  }
  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }
  await rideModel.findByIdAndUpdate(
    rideId,
    {
      status: "ongoing",
    },
    { new: true }
  );

  ride.status = "ongoing";
  await ride.save();
  return ride;
};

exports.endRide = async ({ rideId, captainId }) => {
  const ride = await rideModel.findById(rideId).populate("user");

  if (!ride) throw new Error("Ride not found");
  if (ride.captain.toString() !== captainId.toString())
    throw new Error("Unauthorized");
  if (ride.status !== "ongoing")
    throw new Error("Ride is not ongoing");

  ride.status = "payment_pending";
  ride.payment = {
    status: "PENDING",
    amount: ride.fare,
  };

  await ride.save();
  return ride;
};

module.exports.getRideById = async (rideId) => {
  const ride = await rideModel
    .findById(rideId)
    .populate("user")
    .populate("captain");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.payCashForRide = async ({ rideId }) => {
  const ride = await rideModel
    .findById(rideId)
    .populate("captain");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "payment_pending") {
    throw new Error("Ride is not awaiting payment");
  }

  // Update payment details
  ride.payment = {
    mode: "CASH",
    status: "SUCCESS",
    amount: ride.fare,
  };

  ride.status = "paid";

  await ride.save();

  return ride;
};
