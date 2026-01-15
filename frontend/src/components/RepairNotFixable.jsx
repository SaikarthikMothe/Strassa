import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RepairNotFixable = () => {
  const { repairId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/repair/${repairId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setRepair(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load repair details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [repairId]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  if (error || !repair) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        {error || "Repair not found"}
      </div>
    );
  }

  const inspectionFee = repair.diagnosis?.pricing?.inspection ?? 0;
  const partsFee =
    repair.partAttempted && repair.partInstalled
      ? repair.diagnosis?.pricing?.parts ?? 0
      : 0;

  const totalAmount = repair.finalAmount ?? inspectionFee + partsFee;

  return (
    <div className="h-screen bg-black flex justify-center">
      <div className="w-full max-w-[420px] px-6 py-12 text-white">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold mb-3">
          Inspection Completed
        </h1>

        <p className="text-gray-400 mb-6">
          Our mechanic inspected your vehicle but found that the issue
          cannot be repaired on-site.
        </p>

        {/* REASON */}
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-400 mb-1">Reason</p>
          <p className="text-white">
            {repair.nonFixableReason ||
              "Mechanical issue beyond roadside repair"}
          </p>
        </div>

        {/* CHARGES */}
        <div className="bg-gray-900 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-400 mb-3">Charges</p>

          <div className="flex justify-between text-sm mb-1">
            <span>Inspection</span>
            <span>₹{inspectionFee}</span>
          </div>

          {repair.partAttempted && repair.partInstalled && (
            <div className="flex justify-between text-sm mb-1">
              <span>Parts</span>
              <span>₹{partsFee}</span>
            </div>
          )}

          <div className="border-t border-gray-700 my-3"></div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/repair/payment/${repairId}`)}
          className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg"
        >
          Continue to Payment
        </button>

      </div>
    </div>
  );
};

export default RepairNotFixable;
