import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CaptainFuelDelivery = () => {
  const { fuelRequestId } = useParams();

  const [loading, setLoading] = useState(false);

  const deliverFuel = async () => {
    if (!fuelRequestId) {
      alert("Fuel request ID missing");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/fuel/deliver`,
        { fuelRequestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Fuel marked as delivered");
    } catch (err) {
      alert(err.response?.data?.message || "Delivery failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4">
          Deliver Fuel
        </h2>

        <button
          onClick={deliverFuel}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Updating..." : "Mark as Delivered"}
        </button>
      </div>
    </div>
  );
};

export default CaptainFuelDelivery;
