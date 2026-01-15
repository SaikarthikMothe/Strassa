import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
/* 🔥 Bullet-proof maps opener */
const openInMaps = (lat, lng) => {
  if (!lat || !lng) {
    alert("Location not available");
    return;
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.location.href = url;
};

const badgeStyles = {
  REPAIR: "bg-yellow-400 text-black",
  FUEL: "bg-green-500 text-black",
  RIDE: "bg-blue-500 text-white",
};

export default function IncomingJobPopup({ job, onAccept, onReject }) {
  if (!job) return null;

  const navigate = useNavigate();
  /* ✅ ACCEPT JOB */
  const acceptJob = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/accept`,
        { repairId: job.jobId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // inform parent to close popup
      onAccept?.();
      navigate(`/captain/repair/enroute/${job.jobId}`);
    } catch (err) {
      console.error("Accept failed", err);
      alert("Failed to accept job");
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-black text-white rounded-t-3xl shadow-2xl animate-slideUp">
      {/* HEADER */}
      <div className="px-5 pt-4 pb-2 border-b border-gray-800 flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            badgeStyles[job.jobType]
          }`}
        >
          {job.jobType} REQUEST
        </span>
        <span className="text-xs text-gray-400">Nearby</span>
      </div>

      {/* BODY */}
      <div className="px-5 py-3 space-y-3">
        {/* 📍 LOCATION */}
        <div className="bg-[#121212] rounded-xl p-3">
          <div className="text-xs text-gray-400 mb-1">📍 JOB LOCATION</div>

          <div className="text-sm font-medium text-white">
            {job.payload?.location?.address || "User location"}
          </div>

          <button
            onClick={() =>
              openInMaps(job.payload?.location?.lat, job.payload?.location?.lng)
            }
            className="mt-3 w-full py-2.5 rounded-lg bg-yellow-400 text-black font-semibold"
          >
            🧭 Start Navigation
          </button>
        </div>

        {/* 🛠 REPAIR */}
        {job.jobType === "REPAIR" && (
          <div className="bg-[#121212] rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">🛠 ISSUE</div>
            <div className="text-sm font-semibold text-white">
              {job.payload.issue}
            </div>
            {job.payload.notes && (
              <div className="text-xs text-gray-400 mt-1">
                {job.payload.notes}
              </div>
            )}
          </div>
        )}

        {/* ⛽ FUEL */}
        {job.jobType === "FUEL" && (
          <div className="bg-[#121212] rounded-xl p-3 text-sm">
            Fuel: <b>{job.payload.fuelType}</b> • Qty: {job.payload.quantity} L
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="px-5 py-4 bg-[#0b0b0b] flex gap-3">
        <button
          onClick={onReject}
          className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300"
        >
          Decline
        </button>

        <button
          onClick={acceptJob}
          className="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          Accept Job
        </button>
      </div>
    </div>
  );
}
