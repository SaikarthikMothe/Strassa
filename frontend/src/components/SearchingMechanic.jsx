import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

export default function SearchingMechanic() {
  const { socket } = useContext(SocketContext);
  const { repairRequestId } = useParams();
  const navigate = useNavigate();

  /* 🔌 Socket listener for repair-assigned */
  useEffect(() => {
    if (!socket || !repairRequestId) return;

    const handleAssigned = (data) => {
      // Extract repairId from event data
      let repairId = null;
      
      if (data && data.repairId) {
        repairId = data.repairId;
      } else if (data && data.data && data.data.repairId) {
        repairId = data.data.repairId;
      } else if (typeof data === 'string') {
        repairId = data;
      }

      // Navigate if IDs match
      if (repairId && repairId.toString() === repairRequestId.toString()) {
        navigate(`/repair/assigned/${repairId}`);
      }
    };

    // Listen for repair-assigned event
    socket.on("repair-assigned", handleAssigned);

    return () => {
      socket.off("repair-assigned", handleAssigned);
    };
  }, [socket, repairRequestId, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* 🗺️ MAP PLACEHOLDER */}
      <div className="h-[50vh] bg-gray-800 flex items-center justify-center">
        <span className="text-gray-400">Finding mechanic on map…</span>
      </div>

      {/* 🔍 CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          {/* Animated spinner */}
          <div className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          {/* Wrench icon in center */}
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🔧
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-center">
          Finding a nearby mechanic
        </h2>

        <p className="text-sm text-gray-400 text-center max-w-sm mb-8">
          Please wait while we connect you with a trusted mechanic in your area.
          This usually takes less than 2 minutes.
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Searching</span>
            <span>Connecting</span>
            <span>Assigned</span>
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Your request ID: <span className="text-gray-400">{repairRequestId?.slice(-8)}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            You'll be notified as soon as a mechanic accepts your request
          </p>
        </div>
      </div>
    </div>
  );
}
