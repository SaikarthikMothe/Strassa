import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get user information from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType") || "user";
    
    if (!token) {
      console.log("❌ No token found, skipping socket connection");
      return;
    }

    // Create socket connection
    const socketInstance = io(import.meta.env.VITE_BASE_URL, {
      transports: ["websocket", "polling"],
      auth: {
        token: token
      }
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server:", socketInstance.id);
      setIsConnected(true);
      
      // 🔥 CRITICAL: Emit join event to save socketId in backend
      if (userId) {
        socketInstance.emit("join", { userId, userType });
        console.log(`🚀 Emitted join event: userId=${userId}, userType=${userType}`);
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.log("❌ Socket connection error:", err.message);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up socket connection");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
