const express = require("express");
const router = express.Router();

const fuelController = require("../controllers/fuel.controller");
const auth = require("../middlewares/auth.middleware");

/* USER */
router.post("/create", auth.authUser, fuelController.create);
router.post("/accept", auth.authCaptain, fuelController.accept);
router.post("/deliver", auth.authCaptain, fuelController.deliver);
router.post("/pay-cash", auth.authUser, fuelController.payCash);
router.get("/:fuelRequestId", auth.authUser, fuelController.getById);


module.exports = router;
