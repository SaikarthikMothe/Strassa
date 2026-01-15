import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CaptainRideSummary = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/${rideId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRide(res.data);
    };

    fetchRide();
  }, [rideId]);

  if (!ride) {
    return <div className="p-6">Loading ride summary...</div>;
  }

  return (
    <div className="h-screen bg-white p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Trip Completed</h2>
        <p className="text-gray-500 mt-1">
          Earnings summary for this ride
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span>Fare Earned</span>
            <strong>₹{ride.fare}</strong>
          </div>

          <div className="flex justify-between">
            <span>Payment Mode</span>
            <strong>{ride.payment?.mode}</strong>
          </div>

          <div className="flex justify-between">
            <span>Pickup</span>
            <strong className="text-right">{ride.pickup}</strong>
          </div>

          <div className="flex justify-between">
            <span>Drop</span>
            <strong className="text-right">{ride.destination}</strong>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/captain-home")}
        className="bg-black text-white py-3 rounded-lg text-lg"
      >
        Go Online
      </button>
    </div>
  );
};

export default CaptainRideSummary;
