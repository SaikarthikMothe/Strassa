const Ride = require("../models/ride.model")
const FuelRequest = require("../models/fuelRequest.model")
const RepairRequest = require("../models/repair.model")
const { sendMessageToSocketId } = require("../socket")

exports.acceptJob = async (req, res) => {
  const { jobType, jobId } = req.body
  const captainId = req.captain._id

  let job

  if (jobType === "RIDE") {
    job = await Ride.findByIdAndUpdate(jobId, {
      captain: captainId,
      status: "accepted"
    })
  }

  if (jobType === "FUEL") {
    job = await FuelRequest.findByIdAndUpdate(jobId, {
      captain: captainId,
      status: "assigned"
    })
  }

  if (jobType === "REPAIR") {
    job = await RepairRequest.findByIdAndUpdate(jobId, {
      captain: captainId,
      status: "ASSIGNED"
    })
  }

  sendMessageToSocketId(job.user.socketId, {
    event: "job-assigned",
    data: {
      jobType,
      captain: req.captain
    }
  })

  res.json({ success: true })
}
