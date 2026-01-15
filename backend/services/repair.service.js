const RepairRequest = require("../models/repair.model");

/* ---------- CREATE ---------- */
exports.create = async ({ userId, ...data }) => {
  return RepairRequest.create({
    user: userId,
    ...data,
  });
};

/* ---------- ACCEPT ---------- */
exports.accept = async ({ repairRequestId, captainId }) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (!repair || repair.status !== "PENDING") {
    throw new Error("Repair not available");
  }

  repair.captain = captainId;
  repair.status = "ASSIGNED";
  return repair.save();
};

/* ---------- ENROUTE ---------- */
exports.enroute = async (repairRequestId) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "ASSIGNED") {
    throw new Error("Invalid state");
  }

  repair.status = "ENROUTE";
  return repair.save();
};

/* ---------- QUOTE ---------- */
exports.quote = async ({ repairRequestId, price }) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "ENROUTE") {
    throw new Error("Invalid state");
  }

  repair.quotedPrice = price;
  repair.status = "QUOTED";
  return repair.save();
};

/* ---------- USER APPROVE ---------- */
exports.approve = async (repairRequestId) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "QUOTED") {
    throw new Error("Invalid state");
  }

  repair.status = "APPROVED";
  return repair.save();
};

/* ---------- START WORK ---------- */
exports.startWork = async (repairRequestId) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "APPROVED") {
    throw new Error("Invalid state");
  }

  repair.status = "IN_PROGRESS";
  return repair.save();
};

/* ---------- FIXED ON SITE ---------- */
exports.closeFixed = async (repairRequestId) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "IN_PROGRESS") {
    throw new Error("Invalid state");
  }

  repair.status = "CLOSED";
  repair.outcome = "FIXED";
  return repair.save();
};

/* ---------- NOT FIXABLE ---------- */
exports.markNotFixable = async (repairRequestId) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "IN_PROGRESS") {
    throw new Error("Invalid state");
  }

  repair.status = "DIAGNOSED";
  repair.outcome = "NOT_FIXABLE";
  repair.towingRequired = true;
  return repair.save();
};

/* ---------- OFFER TOWING ---------- */
exports.offerTowing = async ({ repairRequestId, towingPrice }) => {
  const repair = await RepairRequest.findById(repairRequestId);
  if (repair.status !== "DIAGNOSED") {
    throw new Error("Invalid state");
  }

  repair.towingQuote = towingPrice;
  repair.status = "TOWING_OFFERED";
  return repair.save();
};

/* ---------- PAY ---------- */
exports.pay = async (repairRequestId) => {
  const repair = await RepairRequest.findById(repairRequestId);

  if (!repair) {
    throw new Error("Repair not found");
  }

  if (repair.status !== "NOT_FIXABLE") {
    throw new Error(`Cannot pay from ${repair.status}`);
  }

  repair.status = "PAID";
  repair.paidAt = new Date();

  return repair.save();
};


/* ---------- RATE ---------- */
exports.rate = async ({ repairRequestId, rating }) => {
  const repair = await RepairRequest.findById(repairRequestId);

  if (!repair) {
    throw new error("Repair is not found");
  }

  if (repair.status !== "PAID") {
    throw new Error("Invalid state");
  }

  repair.rating = rating;
  return repair.save();
};
