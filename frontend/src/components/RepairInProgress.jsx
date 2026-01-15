import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";

const RepairInProgress = () => {
  const navigate = useNavigate();
  const { repairRequestId } = useParams();
  const { socket } = useContext(SocketContext);
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Simpler repair steps that match your actual flow
  const repairSteps = [
    { id: 1, name: "Requested", status: "completed" },
    { id: 2, name: "Diagnosed", status: "completed" },
    { id: 3, name: "Approved", status: "completed" },
    { id: 4, name: "Repairing", status: "current" },
    { id: 5, name: "Completed", status: "pending" },
  ];
  useEffect(() => {
    if (!socket) return;

    socket.on("repair-outcome", ({ repairId, status }) => {
      if (status === "COMPLETED") {
        navigate(`/repair/completed/${repairId}`);
      }

      if (status === "NOT_FIXABLE") {
        navigate(`/repair/not-fixable/${repairId}`);
      }
    });

    return () => socket.off("repair-outcome");
  }, [socket, navigate]);

  useEffect(() => {
    if (!socket) return;

    const handlePaymentRequired = ({ repairId }) => {
      navigate(`/repair/not-fixable/${repairId}`);
    };

    socket.on("repair-payment-required", handlePaymentRequired);

    return () => {
      socket.off("repair-payment-required", handlePaymentRequired);
    };
  }, [socket, navigate]);

  useEffect(() => {
    if (!repairRequestId) {
      setError("No repair ID provided");
      setLoading(false);
      return;
    }

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
        console.log("Repair data:", res.data);
        setRepair(res.data);

        // Set steps based on actual status
        updateStepsBasedOnStatus(res.data.status);
      } catch (error) {
        console.error("Failed to fetch repair:", error);
        setError("Failed to load repair details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();

    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, [repairRequestId]);

  useEffect(() => {
    if (!socket) return;

    const handleRepairCompleted = (data) => {
      console.log("Repair completed event:", data);
      if (data.repairId === repairRequestId) {
        navigate(`/repair/completed/${repairRequestId}`);
      }
    };

    const handleStatusUpdated = (data) => {
      console.log("Status updated:", data);
      if (data.repairId === repairRequestId) {
        setRepair((prev) => (prev ? { ...prev, status: data.status } : null));
        updateStepsBasedOnStatus(data.status);
      }
    };

    // Listen for events
    socket.on("repair-completed", handleRepairCompleted);
    socket.on("repair-approved", handleStatusUpdated);
    socket.on("repair-started", handleStatusUpdated);
    socket.on("repair-status-updated", handleStatusUpdated);

    return () => {
      socket.off("repair-completed", handleRepairCompleted);
      socket.off("repair-approved", handleStatusUpdated);
      socket.off("repair-started", handleStatusUpdated);
      socket.off("repair-status-updated", handleStatusUpdated);
    };
  }, [socket, navigate, repairRequestId]);

  const updateStepsBasedOnStatus = (status) => {
    // Update steps based on actual repair status from backend
    const statusMap = {
      PENDING: [0, 0, 0, 0, 0],
      ASSIGNED: [1, 0, 0, 0, 0],
      ENROUTE: [1, 0, 0, 0, 0],
      DIAGNOSED: [1, 1, 0, 0, 0],
      APPROVED: [1, 1, 1, 0, 0],
      REPAIRING: [1, 1, 1, 1, 0],
      COMPLETED: [1, 1, 1, 1, 1],
    };

    // This is a simplified version - you can expand this logic
    console.log("Current status:", status);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleCallMechanic = () => {
    if (repair?.captain?.phone) {
      window.location.href = `tel:${repair.captain.phone}`;
    } else {
      alert("Mechanic phone number not available");
    }
  };

  const handleMessage = () => {
    // Implement chat functionality here
    alert("Chat feature coming soon!");
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-400">Loading repair details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center px-6">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-white mb-2">
          Error Loading Repair
        </h1>
        <p className="text-gray-400 text-center mb-6">{error}</p>
        <button
          onClick={() => navigate("/home")}
          className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center px-6">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-white mb-2">Repair Not Found</h1>
        <p className="text-gray-400 text-center mb-6">
          The repair you're looking for doesn't exist or has been completed.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-gray-400">
            ← Back
          </button>
          <div className="text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
            ID: {repairRequestId?.slice(-6)}
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Main Status */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔧</div>
          <h1 className="text-2xl font-bold mb-2">Repair in Progress</h1>
          <p className="text-gray-400">Your vehicle is being repaired</p>

          {/* Time Elapsed */}
          <div className="mt-4 inline-flex items-center bg-gray-900 px-4 py-2 rounded-lg">
            <span className="mr-2">🕒</span>
            <span>{formatTime(timeElapsed)} elapsed</span>
          </div>
        </div>

        {/* Simple Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm">Step 3 of 5</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-300"
              style={{ width: "60%" }}
            ></div>
          </div>

          {/* Simple Steps */}
          <div className="flex justify-between mt-4">
            {repairSteps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    step.status === "completed"
                      ? "bg-green-500"
                      : step.status === "current"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-gray-800"
                  }`}
                >
                  {step.status === "completed" ? "✓" : step.id}
                </div>
                <div
                  className={`text-xs ${
                    step.status === "current"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repair Info Card */}
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-lg mb-4">Repair Information</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="font-medium text-yellow-500">
                {repair.status || "In Progress"}
              </span>
            </div>

            {repair.vehicleType && (
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle</span>
                <span className="font-medium">{repair.vehicleType}</span>
              </div>
            )}

            {repair.issue && (
              <div className="flex justify-between">
                <span className="text-gray-400">Issue</span>
                <span className="font-medium text-right max-w-[60%]">
                  {repair.issue.substring(0, 40)}...
                </span>
              </div>
            )}

            {repair.diagnosis?.pricing?.total && (
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Cost</span>
                <span className="font-medium">
                  ₹{repair.diagnosis.pricing.total}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mechanic Info */}
        {repair.captain && (
          <div className="bg-gray-900 rounded-xl p-5 mb-8">
            <h2 className="font-bold text-lg mb-4">Your Mechanic</h2>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl">👨‍🔧</span>
              </div>
              <div>
                <div className="font-medium">
                  {repair.captain.fullname?.firstname}{" "}
                  {repair.captain.fullname?.lastname}
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  <span>⭐ {repair.captain.avgRating || "4.5"}</span>
                  <span className="mx-2">•</span>
                  <span>Expert Mechanic</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Options */}
        {/* <div className="space-y-4">
          <button
            onClick={handleCallMechanic}
            className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl py-4 flex items-center justify-center"
          >
            <span className="mr-3">📞</span>
            <span>Call Mechanic</span>
          </button>
          
          <button
            onClick={handleMessage}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl py-4 flex items-center justify-center"
          >
            <span className="mr-3">💬</span>
            <span>Send Message</span>
          </button>
          
          <button
            onClick={() => navigate("/support")}
            className="w-full border border-gray-700 hover:border-gray-600 rounded-xl py-4 flex items-center justify-center"
          >
            <span className="mr-3">🆘</span>
            <span>Get Help / Support</span>
          </button>
        </div> */}

        {/* Current Status Indicator */}
        <div className="mt-0 text-center">
          <p className="text-xs text-gray-500 mt-2">
            You will be notified when the repair is completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default RepairInProgress;
