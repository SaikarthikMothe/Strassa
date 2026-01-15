import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const FuelWaiting = () => {
  const { socket } = useContext(SocketContext);
  const { fuelRequestId } = useParams();
  const navigate = useNavigate();

  /* ---------- SOCKET: fuel accepted ---------- */
  useEffect(() => {
    if (!socket) return;

    const handleAccepted = (data) => {
      if (data.fuelRequestId === fuelRequestId) {
        navigate(`/fuel/accepted/${fuelRequestId}`);
      }
    };

    socket.on("fuel-accepted", handleAccepted);
    return () => socket.off("fuel-accepted", handleAccepted);
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

        if (res.data.status === "ACCEPTED") {
          navigate(`/fuel/accepted/${fuelRequestId}`);
          clearInterval(interval);
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
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Finding fuel assistant
          </h2>

          <p className="text-gray-500 mb-6">
            We’re connecting you with a nearby fuel partner
          </p>

          {/* Progress */}
          <div className="space-y-4">
            <StatusRow active text="Request sent" />
            <StatusRow loading text="Searching nearby captains" />
            <StatusRow text="Fuel on the way" />
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

const StatusRow = ({ text, active, loading }) => {
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

export default FuelWaiting;
