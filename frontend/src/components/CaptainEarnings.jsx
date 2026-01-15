import { useEffect, useState } from "react";
import axios from "axios";

const CaptainEarnings = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/earnings/captain`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(res.data);
    };

    fetchEarnings();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Earnings</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-gray-500">Total Earnings</p>
          <p className="text-xl font-bold">₹{data.totalEarnings}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p className="text-gray-500">Total Rides</p>
          <p className="text-xl font-bold">{data.totalRides}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded col-span-2">
          <p className="text-gray-500">Today’s Earnings</p>
          <p className="text-xl font-bold">₹{data.todayEarnings}</p>
        </div>
      </div>

      {/* Ride List */}
      <h3 className="text-lg font-semibold mb-3">
        Completed Rides
      </h3>

      {data.rides.length === 0 && <p>No rides yet</p>}

      {data.rides.map((ride) => (
        <div
          key={ride._id}
          className="border rounded p-3 mb-3"
        >
          <p><b>Fare:</b> ₹{ride.fare}</p>
          <p><b>Pickup:</b> {ride.pickup}</p>
          <p><b>Drop:</b> {ride.destination}</p>
        </div>
      ))}
    </div>
  );
};

export default CaptainEarnings;
