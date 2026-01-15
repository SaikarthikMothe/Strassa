import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaTools,
  FaCheckCircle,
  FaRupeeSign,
  FaShieldAlt,
} from "react-icons/fa";

const RepairPayment = () => {
  const { repairId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

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
      } catch {
        alert("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [repairId]);

  const payNow = async () => {
    setPaying(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/pay`,
        { repairRequestId: repairId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/repair/towing-offer/${repairId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading || !repair) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[420px] flex flex-col px-5 pt-6 pb-4 text-white"
      >
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Summary
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Final step to close this request
          </p>
        </div>

        {/* STATUS BANNER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 mb-5 flex gap-3">
          <FaTools className="text-yellow-400 text-lg mt-1" />
          <div>
            <p className="font-medium">Inspection completed</p>
            <p className="text-sm text-gray-400">
              Repair could not be completed on-site
            </p>
          </div>
        </div>

        {/* INVOICE CARD */}
        <div className="bg-gray-900 rounded-2xl p-5 mb-6">
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">
            Invoice
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Inspection fee</span>
              <span>₹{repair.diagnosis?.pricing?.inspection ?? 0}</span>
            </div>

            {repair.partAttempted && repair.partInstalled && (
              <div className="flex justify-between">
                <span className="text-gray-300">Parts replaced</span>
                <span>₹{repair.diagnosis?.pricing?.parts ?? 0}</span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-gray-700 my-4"></div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total payable</span>
            <span className="text-2xl font-semibold text-yellow-400">
              ₹{repair.finalAmount}
            </span>
          </div>
        </div>

        {/* TRUST & INFO */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2 text-xs text-gray-400">
            <FaCheckCircle className="text-green-400 mt-[2px]" />
            <p>
              You are charged only for inspection and parts installed.
            </p>
          </div>

          <div className="flex gap-2 text-xs text-gray-400">
            <FaShieldAlt className="text-blue-400 mt-[2px]" />
            <p>
              Secure payment • No hidden charges • Invoice available
            </p>
          </div>
        </div>

        {/* STICKY CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={payNow}
          disabled={paying}
          className="mt-auto w-full py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
        >
          <FaRupeeSign />
          {paying ? "Processing payment…" : `Pay ₹${repair.finalAmount}`}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RepairPayment;
