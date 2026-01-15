import React from "react";
import { useNavigate } from "react-router-dom";

const FuelSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm p-6 max-w-md text-center">

        <h2 className="text-3xl font-semibold mb-2">
          ✅ Payment Successful
        </h2>

        <p className="text-gray-500 mb-6">
          Fuel delivery completed successfully
        </p>

        <button
          onClick={() => navigate("/service-selection")}
          className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default FuelSuccess;
