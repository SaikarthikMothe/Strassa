import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const CaptainDiagnose = () => {
  const navigate = useNavigate();
  const { repairRequestId } = useParams();

  const [diagnosis, setDiagnosis] = useState("");
  const [inspection, setInspection] = useState("");
  const [labor, setLabor] = useState("");
  const [parts, setParts] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    return (
      (Number(inspection) || 0) + (Number(labor) || 0) + (Number(parts) || 0)
    );
  }, [inspection, labor, parts]);

  const submitQuote = async () => {
    if (!diagnosis || !inspection || !labor) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        repairId: repairRequestId,
        diagnosis,
        pricing: {
          inspection: Number(inspection),
          labor: Number(labor),
          parts: Number(parts) || 0,
          total,
        },
      };

      console.log("📤 Sending POST request to /repair/diagnose");
      console.log(
        "Request URL:",
        `${import.meta.env.VITE_BASE_URL}/repair/diagnose`
      );
      console.log("Request Data:", JSON.stringify(requestData, null, 2));

      // Send the quote to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/diagnose`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Backend response:", response.data);
      console.log("Response status:", response.status);

      // Navigate to waiting page or captain home
      navigate("/captain-home");

      // Show success message
      alert("Diagnosis sent successfully! Waiting for customer approval.");
    } catch (err) {
      console.error("❌ Quote submission failed:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });

      alert(
        err.response?.data?.message || "Failed to send quote. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  // Add this function in CaptainDiagnose.jsx
  const testSocketManually = async () => {
    try {
      console.log("🧪 Testing socket manually...");

      // Get the repair details first
      const repairRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/repair/${repairRequestId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const repair = repairRes.data;
      console.log("Repair user ID:", repair.user);

      // Test sending socket event
      const testRes = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/test-socket`,
        {
          repairId: repairRequestId,
          userId: repair.user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Test result:", testRes.data);
      alert("Test socket event sent. Check backend logs.");
    } catch (err) {
      console.error("Test failed:", err);
      alert("Test failed: " + err.message);
    }
  };

  // Add this button in the UI (before the submit button)

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* ===== TOP HALF: HEADER & SUMMARY ===== */}
      <div className="h-1/2 bg-gradient-to-b from-yellow-600 to-yellow-400 flex items-center justify-center p-6">
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="ri-search-line text-3xl text-black"></i>
          </div>

          <h1 className="text-3xl font-bold text-black mb-2">
            Vehicle Diagnosis
          </h1>
          <p className="text-black/80 text-lg max-w-md mx-auto">
            Provide detailed diagnosis and send quote to customer
          </p>

          <div className="mt-8 bg-black/10 backdrop-blur-sm rounded-2xl p-4 inline-block">
            <p className="text-black font-medium">
              Repair ID:{" "}
              <span className="font-bold">{repairRequestId?.slice(-6)}</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===== BOTTOM HALF: DIAGNOSIS FORM ===== */}
      <div className="h-1/2 bg-black text-white p-6 flex flex-col">
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Diagnosis Textarea */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <i className="ri-file-text-line mr-2"></i>
              Diagnosis Description *
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Describe the issue, findings, and required repairs..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              rows="3"
              required
            />
          </div>

          {/* Pricing Grid */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              <i className="ri-money-dollar-circle-line mr-2"></i>
              Pricing Breakdown
            </label>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input
                  type="number"
                  placeholder="Inspection (₹)"
                  value={inspection}
                  onChange={(e) => setInspection(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Labor (₹) *"
                  value={labor}
                  onChange={(e) => setLabor(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1">
              <div>
                <input
                  type="number"
                  placeholder="Parts Cost (₹) - Optional"
                  value={parts}
                  onChange={(e) => setParts(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Total Display */}
          <div className="mb-6">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400 font-medium">
                  Estimated Total
                </span>
                <span className="text-3xl font-bold text-yellow-500">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>Inspection Fee</span>
                  <span>₹{(Number(inspection) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Labor Charges</span>
                  <span>₹{(Number(labor) || 0).toLocaleString()}</span>
                </div>
                {parts && (
                  <div className="flex justify-between">
                    <span>Parts Cost</span>
                    <span>₹{(Number(parts) || 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <motion.button
              onClick={submitQuote}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden group"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Sending Quote...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <i className="ri-send-plane-line text-2xl"></i>
                  Send Quote to Customer
                </div>
              )}
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </motion.button>

            <p className="text-center text-sm text-gray-400 mt-3">
              Customer will receive this quote for approval before any work
              begins
            </p>
          </div>
        </motion.div>
      </div>
      {/* <div className="mb-4">
        <button
          onClick={testSocketManually}
          className="w-full py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
        >
          🧪 Test Socket Connection
        </button>
      </div> */}
    </div>
  );
};

export default CaptainDiagnose;
