const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  const allowedOrigins = process.env.CLIENT_URL
    ? [process.env.CLIENT_URL.replace(/\/$/, ""), "http://localhost:5173"]
    : "*";

  io = socketIo(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async ({ userId, userType }) => {
      console.log(
        `👤 User ${userId} joined as ${userType}, socket: ${socket.id}`
      );

      try {
        if (userType === "user") {
          const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true, runValidators: true }
          );

          console.log("✅ Updated user socketId:", updatedUser?.socketId);
          console.log(
            "✅ Matches current socket?",
            updatedUser?.socketId === socket.id
          );
        }

        if (userType === "captain") {
          const updatedCaptain = await captainModel.findByIdAndUpdate(
            userId,
            { socketId: socket.id },
            { new: true, runValidators: true }
          );

          console.log("✅ Updated captain socketId:", updatedCaptain?.socketId);
          console.log(
            "✅ Matches current socket?",
            updatedCaptain?.socketId === socket.id
          );
        }
      } catch (error) {
        console.error("❌ Error updating socketId:", error.message);
      }
    });

    socket.on("update-location-captain", async ({ userId, lat, lng }) => {
      console.log("📍 update-location-captain received:", userId, lat, lng);

      if (lat == null || lng == null) {
        console.log("❌ Invalid lat/lng");
        return;
      }

      const result = await captainModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
            status: "active",
          },
        },
        { new: true }
      );

      console.log("✅ Captain updated:", result);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
