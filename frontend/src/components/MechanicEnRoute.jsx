import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const EnRoutePage = () => {
  const { repairRequestId } = useParams();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // 🔹 Fetch repair details once
  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/repair/${repairRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRepair(res.data);
      } catch (err) {
        console.error("Error fetching repair:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [repairRequestId]);

  // 🔔 Listen for diagnosis completion
  // Add this useEffect to check socket connection
  useEffect(() => {
    if (!socket) {
      console.log("❌ No socket connection available");
      return;
    }

    console.log("✅ Socket connected:", socket.id);
    console.log("Socket connected status:", socket.connected);

    // Log all incoming socket events
    socket.onAny((event, ...args) => {
      console.log(`🎯 Received event: ${event}`, args);
    });

    // Specific handler for repair-diagnosed
    socket.on("repair-diagnosed", (data) => {
      console.log("🎯 repair-diagnosed event received!", data);
      alert("Diagnosis received! Navigating to approval page...");

      // Navigate to approval page
      navigate(`/repair/approve/${data.repairId}`);
    });

    // Cleanup
    return () => {
      socket.offAny();
      socket.off("repair-diagnosed");
    };
  }, [socket, navigate]);

  const handleCancelRequest = async () => {
    if (!window.confirm("Cancel this repair request?")) return;

    try {
      setIsCancelling(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/cancel`,
        { repairRequestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/repair/request");
    } catch (err) {
      alert("Failed to cancel request");
      setIsCancelling(false);
    }
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // ❌ Error state
  if (!repair || !repair.captain) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="mb-4">Unable to load repair details</p>
        <button
          onClick={() => navigate("/repair/request")}
          className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-semibold"
        >
          Back
        </button>
      </div>
    );
  }

  
  const { captain } = repair;

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold mb-6">
        MECHANIC EN ROUTE
      </div>

      <div className="text-5xl mb-4">👨‍🔧</div>

      <h1 className="text-2xl font-bold mb-2">
        {captain.fullname.firstname} is on the way
      </h1>

      <p className="text-gray-400 mb-6 max-w-sm">
        The mechanic is travelling to your location. You will be notified once
        diagnosis is completed.
      </p>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-4 w-full max-w-sm mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Request ID</span>
          <span className="font-mono">#{repairRequestId.slice(-6)}</span>
        </div>
      </div>

      <button
        onClick={handleCancelRequest}
        disabled={isCancelling}
        className="w-full max-w-sm py-3 border border-gray-700 rounded-xl font-medium hover:bg-gray-900 transition disabled:opacity-50"
      >
        {isCancelling ? "Cancelling..." : "Cancel Request"}
      </button>

      <p className="text-xs text-gray-500 mt-6">
        You will be redirected automatically after diagnosis
      </p>
    </div>
  );
};

export default EnRoutePage;
