const express = require("express");
const router = express.Router();
const controller = require("../controllers/repair.controller");
const auth = require("../middlewares/auth.middleware");

/* USER */
router.post("/create", auth.authUser, controller.create);
router.post("/approve", auth.authUser, controller.approve);
router.post("/reject", auth.authUser, controller.reject);
router.post("/pay", auth.authUser, controller.pay);
router.post("/rate", auth.authUser, controller.rate);

/* CAPTAIN */
router.post("/accept", auth.authCaptain, controller.accept);
router.post("/enroute", auth.authCaptain, controller.enroute);
router.post("/cancel", auth.authCaptain, controller.Cancel);
router.post("/diagnose", auth.authCaptain, controller.markDiagnosed);
// In your router file
router.post("/test-socket", controller.testSocket);
router.post("/quote", auth.authCaptain, controller.sendQuote);

router.get("/active",auth.authCaptain,controller.getActiveRepairForCaptain);

router.post("/complete", auth.authCaptain, controller.completeRepair);
router.post("/not-fixable", auth.authCaptain, controller.markNotFixable);
router.post("/offer-towing", auth.authCaptain, controller.offerTowing);

router.get("/:repairRequestId", auth.authCaptain, controller.getById);

module.exports = router;
