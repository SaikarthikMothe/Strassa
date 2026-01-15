import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CaptainTowingEnroute = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const startEnroute = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/towing/update-status`,
      { towingId: id, status: "ENROUTE" },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    navigate(`/captain/towing/progress/${id}`);
  };

  return (
    <div className="h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-[380px] text-center">
        <h2 className="text-lg font-semibold mb-2">
          Navigate to Pickup
        </h2>

        <button
          onClick={startEnroute}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Start Tow
        </button>
      </div>
    </div>
  );
};

export default CaptainTowingEnroute;
