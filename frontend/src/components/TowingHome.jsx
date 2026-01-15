import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaTruck, 
  FaClock, 
  FaShieldAlt,
  FaCheckCircle,
  FaLocationArrow 
} from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { MdError } from "react-icons/md";

const TowingHome = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState(null);
  const addressRef = useRef(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLocationLoading(true);
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });

            try {
              const res = await axios.get(
                `https://nominatim.openstreetmap.org/reverse`,
                {
                  params: {
                    lat: latitude,
                    lon: longitude,
                    format: "json",
                  },
                }
              );
              setAddress(res.data.display_name);
            } catch (geocodeError) {
              setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            } finally {
              setLocationLoading(false);
            }
          },
          (error) => {
            setError("Location access is required for towing service");
            setLocationLoading(false);
          }
        );
      } catch (err) {
        setError(err.message);
        setLocationLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const getQuote = async () => {
    if (!location) {
      setError("Please wait while we get your location");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/towing/quote`,
        {
          pickupLocation: location,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/towing/confirm", {
        state: {
          pickupLocation: location,
          address,
          estimatedPrice: res.data.estimatedPrice,
          etaMinutes: res.data.etaMinutes,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocation = () => {
    // You can implement a map picker or address search here
    alert("Manual location selection coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-70"></div>
            <GiSteeringWheel className="relative text-4xl text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Road Rescue
          </h1>
        </div>
        <p className="text-gray-400 text-center text-sm">
          Reliable towing service at your fingertips
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-md mx-auto bg-gray-800/60 backdrop-blur-lg rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-2xl">
              <FaTruck className="text-2xl text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Emergency Towing Service</h2>
              <p className="text-gray-400 text-sm">Available 24/7</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Location Display */}
          <div className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700/30">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-500/10 p-3 rounded-xl">
                {locationLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
                ) : error ? (
                  <MdError className="text-red-400 text-xl" />
                ) : (
                  <FaMapMarkerAlt className="text-yellow-400 text-xl" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">Current Location</h3>
                  {!locationLoading && !error && (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                      <FaCheckCircle className="text-xs" /> Detected
                    </span>
                  )}
                </div>
                {error ? (
                  <p className="text-red-400 text-sm">{error}</p>
                ) : locationLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-2/3 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <div>
                    <p ref={addressRef} className="text-gray-300 text-sm leading-relaxed">
                      {address || "Location acquired"}
                    </p>
                    <button
                      onClick={handleManualLocation}
                      className="mt-3 text-yellow-400 hover:text-yellow-300 text-xs font-medium flex items-center gap-1"
                    >
                      <FaLocationArrow className="text-xs" />
                      Use different location
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/40 rounded-xl p-4 text-center border border-gray-700/30">
              <FaClock className="text-yellow-400 text-xl mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Quick Response</p>
              <p className="text-gray-400 text-xs">~15 min arrival</p>
            </div>
            <div className="bg-gray-900/40 rounded-xl p-4 text-center border border-gray-700/30">
              <FaShieldAlt className="text-yellow-400 text-xl mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Insured Service</p>
              <p className="text-gray-400 text-xs">Fully protected</p>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-2xl p-5 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-medium">Estimated Cost</span>
              <span className="text-2xl font-bold text-yellow-400">$45-85</span>
            </div>
            <p className="text-gray-400 text-sm">
              Final price calculated based on distance and vehicle type
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={getQuote}
            disabled={loading || locationLoading || error}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-black font-bold py-5 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                <span>Finding Available Tow Trucks...</span>
              </div>
            ) : error ? (
              "Unable to Proceed"
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FaTruck className="text-xl" />
                <span>Request Tow Truck Now</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 text-yellow-400 text-sm">
                <div className="animate-pulse">
                  <FaTruck className="animate-bounce" />
                </div>
                <span>Searching for nearest available tow trucks...</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3 text-red-400">
                <MdError className="text-xl" />
                <div>
                  <p className="font-medium">{error}</p>
                  <p className="text-sm text-red-300/70 mt-1">
                    Please ensure location services are enabled and try again
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="pt-4 border-t border-gray-700/30">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <FaCheckCircle className="text-yellow-400" />
              How it works
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <span className="text-gray-400 text-sm">
                  Share your exact location
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <span className="text-gray-400 text-sm">
                  Get instant price quote
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <span className="text-gray-400 text-sm">
                  Nearest tow truck dispatched
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-md mx-auto mt-6 text-center">
        <p className="text-gray-500 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          <span className="text-gray-400 text-sm">24/7 Support</span>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default TowingHome;