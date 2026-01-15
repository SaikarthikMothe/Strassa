const express = require("express");
const router = express.Router();
const controller = require("../controllers/towing.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/quote", auth.authUser, controller.getTowingQuote);
router.post("/create", auth.authUser, controller.createTowing);
router.post("/cancel", auth.authUser, controller.cancelTowing);

router.post("/accept", auth.authCaptain, controller.acceptTowing);
router.post("/reject", auth.authCaptain, controller.rejectTowing);
router.post("/update-status", auth.authCaptain, controller.updateTowingStatus);

router.post("/payment", auth.authUser, controller.payForTowing);

module.exports = router;
