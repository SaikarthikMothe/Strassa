import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CaptainEnRoute() {
  const { repairRequestId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     Fetch repair details
  ========================== */
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
      } catch (err) {
        console.error("❌ Failed to fetch repair", err);
      }
    };

    fetchRepair();
  }, [repairRequestId]);

  /* =========================
     MARK DIAGNOSED (ARRIVED + INSPECTED)
  ========================== */
  /* =========================
   MARK ENROUTE FIRST, THEN DIAGNOSE
========================== */
  /* =========================
   ARRIVE AND PROCEED TO DIAGNOSE
========================== */
  const arriveAndDiagnose = async () => {
    try {
      setLoading(true);

      // Step 1: Always try to mark as ENROUTE (idempotent)
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/repair/enroute`,
          { repairId: repairRequestId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (enrouteErr) {
        // If it's already ENROUTE, that's okay, continue
        if (
          enrouteErr.response?.status === 400 &&
          enrouteErr.response?.data?.message?.includes(
            "Cannot mark ENROUTE from ENROUTE"
          )
        ) {
          console.log("Already enroute, proceeding to diagnose...");
        } else {
          throw enrouteErr;
        }
      }

      // Step 2: Navigate directly to Diagnose page
      // (Diagnosis will be entered on the next screen)
      navigate(`/captain/repair/diagnose/${repairRequestId}`);
    } catch (err) {
      console.error("❌ Failed to proceed", err);
      alert(err.response?.data?.message || "Failed to proceed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING STATE
  ========================== */
  if (!repair) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-500 font-medium">
            Loading repair details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* ===== TOP HALF: MAP/NAVIGATION ===== */}
      <div className="h-1/2 bg-gradient-to-b from-yellow-600 to-yellow-400 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-map-pin-line text-3xl text-black"></i>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            Navigating to Customer
          </h2>
          <div className="bg-black/20 rounded-full px-4 py-1 inline-block mb-6">
            <p className="text-black font-medium">ETA: 12 min • 4.7 km away</p>
          </div>

          <div className="flex justify-center gap-3">
            <button className="bg-black text-yellow-500 px-6 py-2 rounded-full font-bold border border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
              <i className="ri-phone-line mr-2"></i>
              Call
            </button>
            <button className="bg-black text-yellow-500 px-6 py-2 rounded-full font-bold border border-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
              <i className="ri-message-3-line mr-2"></i>
              Message
            </button>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM HALF: DETAILS ===== */}
      <div className="h-1/2 bg-black text-white flex flex-col p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-yellow-500 mb-1">
            En Route to Customer
          </h1>
          <p className="text-gray-300 text-sm">
            Tap below when you reach the location
          </p>
        </div>

        {/* Issue Card - Fixed Height */}
        <div className="bg-gray-900 rounded-2xl p-4 mb-3 border border-gray-800 flex-shrink-0">
          <div className="flex items-start">
            <div className="bg-yellow-500 p-2 rounded-lg mr-3 flex-shrink-0">
              <i className="ri-tools-line text-xl text-black"></i>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-400 mb-1">Issue</p>
              <p className="font-medium text-white truncate">{repair.issue}</p>
              {repair.notes && (
                <p className="text-sm text-gray-300 mt-1 truncate">
                  {repair.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location Card - Fixed Height */}
        <div className="bg-gray-900 rounded-2xl p-4 mb-4 border border-gray-800 flex-shrink-0">
          <div className="flex items-start mb-3">
            <div className="bg-yellow-500 p-2 rounded-lg mr-3 flex-shrink-0">
              <i className="ri-map-pin-line text-xl text-black"></i>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-400 mb-1">Customer Location</p>
              <p className="font-medium text-white truncate">
                {repair.location?.address || "User location"}
              </p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${repair.location?.lat},${repair.location?.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-600 transition-colors"
          >
            <i className="ri-navigation-line"></i>
            Open in Google Maps
          </a>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Arrived Button - Always visible at bottom */}
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={arriveAndDiagnose}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <i className="ri-checkbox-circle-line text-2xl"></i>
                I've Arrived & Inspected
              </div>
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-2">
            This will notify the customer of your arrival
          </p>
        </div>
      </div>
    </div>
  );
}
