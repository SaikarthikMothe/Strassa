import { useEffect, useState } from "react";
import axios from "axios";

const CaptainRideHistory = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/history/captain`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRides(res.data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Completed Trips
      </h2>

      {rides.length === 0 && <p>No trips yet</p>}

      {rides.map((ride) => (
        <div
          key={ride._id}
          className="border rounded-lg p-4 mb-3"
        >
          <p>
            <b>User:</b>{" "}
            {ride.user.fullname.firstname}
          </p>
          <p>
            <b>Fare:</b> ₹{ride.fare}
          </p>
          <p>
            <b>Pickup:</b> {ride.pickup}
          </p>
          <p>
            <b>Drop:</b> {ride.destination}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CaptainRideHistory;
