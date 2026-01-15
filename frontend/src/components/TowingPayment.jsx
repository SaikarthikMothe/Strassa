import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaTruck, FaRupeeSign, FaCheckCircle } from "react-icons/fa";

const TowingPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pay = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/towing/payment`,
        { towingId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/towing/completion/${id}`);
    } catch {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-yellow-400 to-black flex justify-center items-center">
      <div className="bg-white rounded-3xl p-6 w-[90%] max-w-[420px] shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaTruck className="text-yellow-500 text-3xl" />
          <h2 className="text-xl font-bold text-gray-800">
            Towing Completed
          </h2>
        </div>

        {/* Success Icon */}
        <div className="text-center mb-5">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-2" />
          <p className="text-gray-700 font-medium">
            Your vehicle has been safely delivered
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-black rounded-2xl p-5 text-center mb-6">
          <FaRupeeSign className="text-yellow-400 text-3xl mx-auto mb-2" />
          <p className="text-yellow-400 text-2xl font-bold">
            Pay for Towing
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Secure & instant payment
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={pay}
          className="w-full bg-black text-yellow-400 py-3 rounded-xl font-semibold text-lg"
        >
          Pay Now
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Thank you for using our roadside assistance service
        </p>
      </div>
    </div>
  );
};

export default TowingPayment;
