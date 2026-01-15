const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const rideController = require("../controllers/ride.controller");

router.post(
  "/create",
  authMiddleware.authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isIn(["car", "auto", "motorcycle"])
    .withMessage("Invalid vehicle type"),
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.authUser,
  query("pickup").isString().isLength({ min: 3 }).withMessage("Invalid pickup"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination"),
  rideController.getFare
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.confirmRide
);

router.post(
  "/start-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  body("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  rideController.startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.endRide
);

router.post(
  "/pay-cash",
  authMiddleware.authUser,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.payCash
);

router.get(
  "/:rideId",
  authMiddleware.authCaptain,
  rideController.getRideById
);

router.post(
  "/rate-captain",
  authMiddleware.authUser,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  rideController.rateCaptain
)

router.get(
  "/history/user",
  authMiddleware.authUser,
  rideController.getUserRideHistory
);

router.get(
  "/history/captain",
  authMiddleware.authCaptain,
  rideController.getCaptainRideHistory
);

router.get(
  "/earnings/captain",
  authMiddleware.authCaptain,
  rideController.getCaptainEarnings
)


module.exports = router;
