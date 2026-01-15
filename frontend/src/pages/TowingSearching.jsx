import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import { FaTruck, FaSpinner } from "react-icons/fa";

const TowingSearching = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const { id: towingId } = useParams();

  useEffect(() => {
    if (!socket) return;

    const onAssigned = ({ towingId: assignedId }) => {
      if (assignedId === towingId) {
        navigate(`/towing/tracking/${towingId}`);
      }
    };

    const onCancelled = ({ towingId: cancelledId }) => {
      if (cancelledId === towingId) {
        navigate("/home");
      }
    };

    socket.on("towing-assigned", onAssigned);
    socket.on("towing-cancelled", onCancelled);

    return () => {
      socket.off("towing-assigned", onAssigned);
      socket.off("towing-cancelled", onCancelled);
    };
  }, [socket, towingId, navigate]);

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-400 to-black flex justify-center items-center">
      <div className="bg-white rounded-3xl p-7 w-[90%] max-w-[420px] shadow-2xl text-center">

        {/* Animated Icon */}
        <div className="relative mb-6">
          <FaTruck className="text-yellow-500 text-5xl mx-auto" />
          <FaSpinner className="text-black text-4xl absolute inset-0 mx-auto animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Finding a Towing Partner
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-6">
          We’re locating the nearest available tow truck for you.
          <br />
          Please stay near your vehicle.
        </p>

        {/* Status Card */}
        <div className="bg-black rounded-2xl p-4">
          <p className="text-yellow-400 font-semibold">
            Searching nearby drivers…
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This usually takes less than a minute
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6">
          You’ll be notified as soon as a towing partner accepts
        </p>
      </div>
    </div>
  );
};

export default TowingSearching;
