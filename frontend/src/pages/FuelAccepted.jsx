import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const FuelAccepted = () => {
  const { socket } = useContext(SocketContext);
  const { fuelRequestId } = useParams();
  const navigate = useNavigate();

  const [captain, setCaptain] = useState(null);

  /* ---------- SOCKET: fuel delivered ---------- */
  useEffect(() => {
    if (!socket) return;

    const handleDelivered = (data) => {
      if (data.fuelRequestId === fuelRequestId) {
        navigate(`/fuel/payment/${fuelRequestId}`);
      }
    };

    socket.on("fuel-delivered", handleDelivered);
    return () => socket.off("fuel-delivered", handleDelivered);
  }, [socket, fuelRequestId, navigate]);

  /* ---------- POLLING FALLBACK ---------- */
  useEffect(() => {
    let interval;

    const checkStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/fuel/${fuelRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.status === "DELIVERED") {
          navigate(`/fuel/payment/${fuelRequestId}`);
          clearInterval(interval);
        }

        if (res.data.captain) {
          setCaptain(res.data.captain);
        }
      } catch {}
    };

    interval = setInterval(checkStatus, 2000);
    checkStatus();

    return () => clearInterval(interval);
  }, [fuelRequestId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 pt-16">
      <div className="w-full max-w-md">

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Fuel on the way
          </h2>

          <p className="text-gray-500 mb-6">
            Your fuel assistant is heading to you
          </p>

          {/* Captain Card */}
          {captain && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Fuel Assistant</p>
              <p className="text-lg font-medium">
                {captain.fullname?.firstname || "Captain"}
              </p>
              <p className="text-sm text-gray-500">
                📞 {captain.phone || "Contact unavailable"}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <TimelineStep active text="Request accepted" />
            <TimelineStep active text="Fuel picked up" />
            <TimelineStep loading text="Arriving at your location" />
          </div>

          {/* Loader */}
          <div className="flex justify-center mt-8">
            <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Request ID • {fuelRequestId.slice(-6)}
        </p>
      </div>
    </div>
  );
};

const TimelineStep = ({ text, active, loading }) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-3 w-3 rounded-full ${
          active
            ? "bg-black"
            : loading
            ? "bg-gray-400 animate-pulse"
            : "bg-gray-300"
        }`}
      />
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default FuelAccepted;
