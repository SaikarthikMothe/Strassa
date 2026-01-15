import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserRepairApproval = () => {
  const { repairRequestId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/repair/${repairRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRepair(res.data);
      } catch {
        alert("Failed to load repair details");
      } finally {
        setLoading(false);
      }
    };
    fetchRepair();
  }, [repairRequestId]);

  const approve = async () => {
    try {
      setActionLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/approve`,
        { repairRequestId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate(`/repair/in-progress/${repairRequestId}`);
    } catch {
      alert("Approval failed");
    } finally {
      setActionLoading(false);
    }
  };
  const reject = async () => {
    if (!window.confirm("Reject repair? Inspection charges apply.")) return;
    try {
      setActionLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/reject`,
        { repairRequestId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      navigate("/home");
    } catch {
      alert("Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!repair || repair.status !== "DIAGNOSED") {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        No diagnosis available
      </div>
    );
  }

  const { note, pricing } = repair.diagnosis;
  const mechanic = repair.captain;

  return (
    <div className="h-screen bg-black flex justify-center overflow-hidden">
      {/* PHONE CONTAINER */}
      <div className="w-full max-w-[420px] h-screen flex flex-col text-white">
        {/* HEADER */}
        <div className="h-[22vh] bg-yellow-400 text-black px-5 flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Repair Diagnosis</h1>
          <p className="text-sm opacity-90">
            Review & approve before work begins
          </p>

          <div className="mt-3 flex justify-between items-end">
            <div className="text-xs font-medium">
              ID #{repairRequestId.slice(-6)}
            </div>
            <div className="text-right">
              <div className="text-xs">Total</div>
              <div className="text-2xl font-bold">₹{pricing.total}</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Diagnosis */}
          <div className="bg-[#161616] rounded-xl p-4 border border-gray-800">
            <div className="text-xs text-gray-400 mb-1">DIAGNOSIS</div>
            <p className="text-sm text-gray-200 leading-relaxed line-clamp-5">
              {note}
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-[#161616] rounded-xl p-4 border border-gray-800">
            <div className="text-xs text-gray-400 mb-3">PRICE BREAKDOWN</div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Inspection</span>
                <span>₹{pricing.inspection}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor</span>
                <span>₹{pricing.labor}</span>
              </div>
              {pricing.parts > 0 && (
                <div className="flex justify-between">
                  <span>Parts</span>
                  <span>₹{pricing.parts}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between font-semibold text-yellow-400">
              <span>Total</span>
              <span>₹{pricing.total}</span>
            </div>
          </div>

          {/* Mechanic */}
          {mechanic && (
            <div className="bg-[#161616] rounded-xl p-4 border border-gray-800">
              <div className="text-xs text-gray-400 mb-1">MECHANIC</div>
              <div className="font-medium">
                {mechanic.fullname.firstname} {mechanic.fullname.lastname}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                ⭐ {mechanic.avgRating || 4.7}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-auto space-y-3">
            <button
              onClick={approve}
              disabled={actionLoading}
              className="w-full py-3 bg-yellow-400 text-black rounded-xl font-bold"
            >
              Approve & Proceed
            </button>

            <button
              onClick={reject}
              disabled={actionLoading}
              className="w-full py-3 border border-gray-700 rounded-xl text-gray-300"
            >
              Reject Repair
            </button>

            <p className="text-xs text-gray-500 text-center">
              No work starts without your approval
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRepairApproval;
