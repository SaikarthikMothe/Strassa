import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FuelRequest = () => {
  const navigate = useNavigate();

  const [fuelType, setFuelType] = useState("PETROL");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const PRICE = {
    PETROL: 110,
    DIESEL: 95,
  };

  const totalAmount = PRICE[fuelType] * quantity;

  /* 📍 Get location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("Please allow location access");
      }
    );
  }, []);

  /* ⛽ Request Fuel */
  const requestFuel = async () => {
    if (!location) {
      alert("Detecting location, please wait");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/fuel/create`,
        {
          fuelType,
          quantity,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate(`/fuel/waiting/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Fuel request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-1">⛽ Mobile Fuel</h1>
        <p className="text-gray-500 mb-6">Get fuel delivered to your vehicle</p>

        {/* Fuel Type */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Fuel Type</p>
          <div className="flex gap-3">
            {["PETROL", "DIESEL"].map((type) => (
              <button
                key={type}
                onClick={() => setFuelType(type)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition
                  ${
                    fuelType === type
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
              >
                {type === "PETROL" ? "Petrol" : "Diesel"}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Quantity (Litres)</p>
          <input
            type="range"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1L</span>
            <span className="font-semibold text-black">{quantity} L</span>
            <span>20L</span>
          </div>
        </div>

        {/* Price Card */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Price / L</span>
            <span>₹{PRICE[fuelType]}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-medium">Total Amount</span>
            <span className="text-xl font-semibold">₹{totalAmount}</span>
          </div>
        </div>

        {/* Location */}
        <div className="text-sm text-gray-500 mb-6">
          {location ? "📍 Location detected" : "📍 Detecting location..."}
        </div>

        {/* CTA */}
        <button
          onClick={requestFuel}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium disabled:opacity-50"
        >
          {loading ? "Requesting..." : "Request Fuel"}
        </button>
      </div>
    </div>
  );
};

export default FuelRequest;
