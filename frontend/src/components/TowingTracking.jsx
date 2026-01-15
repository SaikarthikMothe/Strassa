import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaTruck,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const STATUS_TEXT = {
  ASSIGNED: "Tow truck assigned",
  ENROUTE: "Tow truck is on the way",
  VEHICLE_LOADED: "Vehicle loaded, heading to destination",
  COMPLETED: "Towing completed",
};

const TowingTracking = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const { id: towingId } = useParams();
  const [status, setStatus] = useState("ASSIGNED");

  useEffect(() => {
    if (!socket) return;

    const onStatusUpdate = ({ towingId: updatedId, status }) => {
      if (updatedId !== towingId) return;

      setStatus(status);

      if (status === "COMPLETED") {
        setTimeout(() => {
          navigate(`/towing/payment/${towingId}`);
        }, 1200);
      }
    };

    socket.on("towing-status-update", onStatusUpdate);

    return () => {
      socket.off("towing-status-update", onStatusUpdate);
    };
  }, [socket, towingId, navigate]);

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-400 to-black flex justify-center items-center">
      <div className="bg-white rounded-3xl p-6 w-[90%] max-w-[420px] shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <FaTruck className="text-yellow-500 text-3xl" />
          <h2 className="text-xl font-bold text-gray-800">
            Towing in Progress
          </h2>
        </div>

        {/* Status Card */}
        <div className="bg-black rounded-2xl p-5 text-center mb-6">
          <FaClock className="text-yellow-400 text-3xl mx-auto mb-3 animate-pulse" />
          <p className="text-yellow-400 text-lg font-semibold">
            {STATUS_TEXT[status]}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Please stay near your vehicle
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          <Step label="Tow truck assigned" done />
          <Step
            label="On the way"
            done={["ENROUTE", "VEHICLE_LOADED", "COMPLETED"].includes(status)}
          />
          <Step
            label="Vehicle loaded"
            done={["VEHICLE_LOADED", "COMPLETED"].includes(status)}
          />
          <Step label="Completed" done={status === "COMPLETED"} />
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          We’ll notify you as the status updates
        </p>
      </div>
    </div>
  );
};

const Step = ({ label, done }) => (
  <div className="flex items-center gap-3">
    {done ? (
      <FaCheckCircle className="text-green-500" />
    ) : (
      <FaMapMarkedAlt className="text-gray-400" />
    )}
    <p className={`text-sm ${done ? "text-gray-800" : "text-gray-400"}`}>
      {label}
    </p>
  </div>
);

export default TowingTracking;
