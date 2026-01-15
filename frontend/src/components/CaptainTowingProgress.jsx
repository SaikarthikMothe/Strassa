import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CaptainTowingProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const markLoaded = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/towing/update-status`,
      { towingId: id, status: "VEHICLE_LOADED" },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  };

  const markDelivered = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/towing/update-status`,
      { towingId: id, status: "COMPLETED" },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    navigate("/captain-home");
  };

  return (
    <div className="h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-[380px]">
        <h2 className="text-lg font-semibold mb-4">
          Towing Progress
        </h2>

        <button
          onClick={markLoaded}
          className="w-full bg-blue-500 text-white py-3 rounded-xl mb-3"
        >
          Vehicle Loaded
        </button>

        <button
          onClick={markDelivered}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          Delivered
        </button>
      </div>
    </div>
  );
};

export default CaptainTowingProgress;
