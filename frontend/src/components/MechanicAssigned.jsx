import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MechanicAssigned = () => {
  const { repairRequestId } = useParams();
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState("15-30 min");

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/repair/${repairRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRepair(res.data);
        
        setTimeout(() => {
          setEta(`${Math.floor(Math.random() * 15) + 15}-${Math.floor(Math.random() * 15) + 30} min`);
        }, 500);
        
      } catch (err) {
        console.error("Error fetching repair:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [repairRequestId]);

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            🔧
          </div>
        </div>
        <p className="text-lg font-medium mb-2">Confirming assignment...</p>
      </div>
    );
  }

  if (!repair || !repair.captain) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Assignment Error</h2>
        <p className="text-gray-400 text-center mb-6">
          We couldn't retrieve the mechanic assignment.
        </p>
        <button
          className="px-6 py-3 bg-yellow-400 text-black rounded-full font-semibold"
          onClick={() => navigate("/service-selection")}
        >
          Back to Services
        </button>
      </div>
    );
  }

  const { captain } = repair;
  const rating = captain.avgRating || 4.7;
  const jobsCompleted = captain.totalRatings || 47;

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      
      {/* Uber-style Header */}
      <div className="pt-14 pb-4 px-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mechanic Assigned</h1>
            <p className="text-gray-400 text-sm">ETA: <span className="text-white font-medium">{eta}</span></p>
          </div>
          <div className="bg-gray-900 rounded-full px-4 py-2">
            <span className="text-xs text-gray-400">ID:</span>
            <span className="text-xs font-mono ml-1">#{repairRequestId?.slice(-8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Content - No Scroll */}
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* Mechanic Profile Card - Uber-style */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-6 mt-6 bg-[#161616] rounded-xl p-4 border border-gray-800"
        >
          <div className="flex items-start">
            {/* Mechanic Photo/Initials */}
            <div className="relative">
              <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center border-2 border-gray-700">
                <span className="text-2xl text-gray-300">👨‍🔧</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
            </div>
            
            {/* Mechanic Info */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    {captain.fullname.firstname} {captain.fullname.lastname}
                  </h2>
                  <p className="text-gray-400 text-sm">Certified Mechanic</p>
                </div>
                <div className="flex items-center bg-gray-900 px-3 py-1 rounded-full">
                  <span className="text-yellow-400 text-sm mr-1">★</span>
                  <span className="font-bold">{rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs ml-1">({jobsCompleted})</span>
                </div>
              </div>
              
              {/* Vehicle Info */}
              <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">SERVICE VEHICLE</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#222] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-lg">🚙</span>
                    </div>
                    <div>
                      <div className="font-medium">{captain.vehicle?.plate || "MECH-001"}</div>
                      <div className="text-xs text-gray-400">
                        {captain.vehicle?.color || "Black"} • {captain.vehicle?.vehicleType || "Service Van"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Issue Card */}
        <div className="mx-6 mt-4 bg-[#161616] rounded-xl p-4 border border-gray-800">
          <div className="text-xs text-gray-400 mb-2">ISSUE DETAILS</div>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{repair.issue}</div>
              {repair.notes && (
                <div className="text-gray-400 text-sm mt-1">{repair.notes}</div>
              )}
            </div>
            <div className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
              ASSIGNED
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <div className="mx-6 mt-4">
          <div className="text-xs text-gray-400 mb-3">STATUS</div>
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-sm">1</span>
              </div>
              <div className="text-xs font-medium">Requested</div>
            </div>
            
            {/* Connecting Line */}
            <div className="flex-1 h-0.5 bg-green-500"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-sm">2</span>
              </div>
              <div className="text-xs font-medium">Assigned</div>
            </div>
            
            {/* Connecting Line */}
            <div className="flex-1 h-0.5 bg-gray-700"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <span className="text-sm">3</span>
              </div>
              <div className="text-xs font-medium">En Route</div>
            </div>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Track Button - Fixed at bottom */}
        <div className="p-6 border-t border-gray-800 bg-black">
          <button
            className="w-full py-4 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:bg-yellow-500 transition"
            onClick={() => navigate(`/repair/enroute/${repairRequestId}`)}
          >
            Track Mechanic
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">
            Mechanic is preparing to head to your location
          </p>
        </div>
      </div>
    </div>
  );
};

export default MechanicAssigned;
