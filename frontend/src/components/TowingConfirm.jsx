import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaTruck, 
  FaClock, 
  FaRupeeSign,
  FaCheckCircle,
  FaShieldAlt,
  FaRoute,
  FaInfoCircle,
  FaPhoneAlt,
  FaArrowLeft
} from "react-icons/fa";
import { GiSteeringWheel, GiCarKey } from "react-icons/gi";
import { MdLocationOn, MdWarning } from "react-icons/md";
import { TbMapPinCheck } from "react-icons/tb";

const TowingConfirm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState("car");
  const [serviceType, setServiceType] = useState("tow");
  const [distance, setDistance] = useState(8);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!state) {
      navigate("/towing");
      return;
    }

    // Auto-calculate based on distance
    if (state.estimatedDistanceKm) {
      setDistance(state.estimatedDistanceKm);
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, navigate]);

  if (!state) return null;

  const confirm = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/towing/create`,
        {
          pickupLocation: {
            ...state.pickupLocation,
            address: state.address,
          },
          quoteAmount: state.estimatedPrice,
          etaMinutes: state.etaMinutes,
          distanceKm: distance,
          vehicleType: vehicleType,
          serviceType: serviceType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/towing/searching/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm towing");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/towing");
  };

  const formatAddress = (addr) => {
    if (!addr) return "Location not available";
    const parts = addr.split(",");
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[1]}, ${parts[parts.length - 1]}`;
    }
    return addr;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6">
      {/* Header */}
      {/* <div className="max-w-md mx-auto mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        
      </div> */}

      {/* Main Card */}
      <div className="max-w-md mx-auto bg-gray-800/60 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-700">
          <div className="h-full w-2/3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-r-full"></div>
        </div>

        {/* Card Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-3 rounded-2xl">
              <FaCheckCircle className="text-2xl text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Review & Confirm</h2>
              <p className="text-gray-400 text-sm">Confirm details to dispatch tow truck</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Location Card */}
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-5 border border-gray-700/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500/10 p-2 rounded-lg">
                <TbMapPinCheck className="text-yellow-400 text-xl" />
              </div>
              <h3 className="text-white font-semibold">Pickup Location</h3>
            </div>
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-red-400 text-lg mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {formatAddress(state.address)}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  GPS Coordinates: {state.pickupLocation?.lat?.toFixed(6)}, {state.pickupLocation?.lng?.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & ETA Card */}
          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-2xl p-5 border border-yellow-500/20">
            <div className="grid grid-cols-2 gap-6 mb-5">
              {/* Price */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <FaRupeeSign className="text-yellow-400" />
                  </div>
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-yellow-400">₹{state.estimatedPrice}</span>
                  <span className="text-gray-400 text-sm ml-1">INR</span>
                </div>
                <p className="text-gray-400 text-xs">Estimated Fare</p>
              </div>

              {/* ETA */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <FaClock className="text-yellow-400" />
                  </div>
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-yellow-400">{state.etaMinutes}</span>
                  <span className="text-gray-400 text-sm ml-1">min</span>
                </div>
                <p className="text-gray-400 text-xs">Estimated Arrival</p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center justify-center gap-3 p-3 bg-black/30 rounded-xl">
              <FaRoute className="text-yellow-400" />
              <span className="text-white">{distance} km</span>
              <span className="text-gray-400 text-sm">Distance</span>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-gray-900/40 rounded-2xl p-5 border border-gray-700/30">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-yellow-400" />
              Service Includes
            </h4>
            <ul className="space-y-3">
              {[
                "Professional towing crew",
                "Insurance coverage up to ₹5 lakh",
                "GPS tracking of your tow truck",
                "24/7 roadside assistance",
                "Digital receipt & trip history"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-700/30">
            <button
              onClick={confirm}
              disabled={loading || countdown === 0}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  <span>Confirming...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <FaCheckCircle className="text-xl" />
                  <span>Confirm & Dispatch Tow Truck</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button
              onClick={handleBack}
              className="w-full text-gray-400 hover:text-white font-medium py-3 text-sm transition-colors"
            >
              Cancel Request
            </button>
          </div>

          {/* Support Info */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <FaPhoneAlt />
              <span>Need help? Call</span>
              <a href="tel:18001234567" className="text-yellow-400 hover:text-yellow-300">
                1800-123-4567
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <p className="text-gray-500 text-xs">
          By confirming, you agree to our Terms of Service and confirm that your vehicle is in a safe location for towing.
        </p>
      </div>
    </div>
  );
};

export default TowingConfirm;