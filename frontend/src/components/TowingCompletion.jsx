import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTruck } from "react-icons/fa";

const TowingCompletion = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-400 to-black flex justify-center items-center">
      <div className="bg-white rounded-3xl p-7 w-[90%] max-w-[420px] shadow-2xl text-center">

        {/* Icon */}
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Towing Completed Successfully
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-6">
          Your vehicle has been safely delivered.  
          Thank you for trusting our roadside assistance.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaTruck className="text-yellow-500" />
          <span className="text-xs text-gray-500">
            Emergency Towing Service
          </span>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-black text-yellow-400 py-3 rounded-xl font-semibold text-lg"
        >
          Go to Home
        </button>

        {/* Optional next step */}
        <p className="text-xs text-gray-500 mt-4">
          You can rate your experience from the home screen
        </p>
      </div>
    </div>
  );
};

export default TowingCompletion;
