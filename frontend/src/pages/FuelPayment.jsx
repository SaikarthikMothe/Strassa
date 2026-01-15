import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FuelPayment = () => {
  const { fuelRequestId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- Fetch amount ---------- */
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/fuel/${fuelRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAmount(res.data.totalAmount);
      } catch {}
    };

    fetchDetails();
  }, [fuelRequestId]);

  /* ---------- Pay cash ---------- */
  const payCash = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/fuel/pay-cash`,
        { fuelRequestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/fuel/success");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 pt-16">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-2">
            Complete payment
          </h2>

          <p className="text-gray-500 mb-8">
            Please pay the fuel assistant
          </p>

          {/* Amount */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center mb-8">
            <p className="text-sm text-gray-500 mb-2">
              Total amount
            </p>
            <p className="text-4xl font-semibold">
              ₹{amount ?? "--"}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={payCash}
            disabled={loading || !amount}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay cash"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Request ID • {fuelRequestId.slice(-6)}
        </p>
      </div>
    </div>
  );
};

export default FuelPayment;
