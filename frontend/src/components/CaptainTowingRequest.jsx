import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTruck } from "react-icons/fa";

const CaptainTowingRequest = ({ request, onClose }) => {
  const navigate = useNavigate();

  const accept = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/towing/accept`,
      { towingId: request.towingId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    onClose();
    navigate(`/captain/towing/enroute/${request.towingId}`);
  };

  const reject = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/towing/reject`,
      { towingId: request.towingId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    onClose();
  };

  const openMaps = () => {
    const { lat, lng } = request.pickupLocation;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <div className="fixed bottom-0 w-full bg-white p-5 shadow-2xl rounded-t-3xl z-50">
      
      <div className="flex items-center gap-3 mb-3">
        <FaTruck className="text-yellow-500 text-2xl" />
        <h3 className="font-bold text-lg text-gray-800">
          New Towing Request
        </h3>
      </div>

      {/* 📍 Location */}
      <div className="bg-gray-100 rounded-xl p-3 mb-3">
        <div className="flex items-start gap-2">
          <FaMapMarkerAlt className="text-red-500 mt-1" />
          <p className="text-sm text-gray-700">
            {request.pickupLocation?.address || "Pickup location"}
          </p>
        </div>

        <button
          onClick={openMaps}
          className="text-sm text-blue-600 underline mt-2"
        >
          Open in Google Maps
        </button>
      </div>

      {/* 💰 Fare */}
      <p className="text-sm text-gray-700 mb-4">
        Estimated Fare: <span className="font-semibold">₹{request.quoteAmount}</span>
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={accept}
          className="flex-1 bg-black text-yellow-400 py-3 rounded-xl font-semibold"
        >
          Accept
        </button>

        <button
          onClick={reject}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CaptainTowingRequest;
