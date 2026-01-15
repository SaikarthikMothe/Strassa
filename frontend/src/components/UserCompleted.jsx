import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserCompleted = () => {
  const { repairRequestId } = useParams();
  const navigate = useNavigate();

  const [repair, setRepair] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        alert("Unable to load repair details");
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [repairRequestId]);

  const submitRating = async () => {
    if (!rating) return;

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/repair/rate`,
        {
          repairRequestId: repairRequestId,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/home");
    } catch {
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex justify-center overflow-hidden">
      <div className="w-full max-w-[420px] h-screen flex flex-col text-white">

        {/* TOP MESSAGE */}
        <div className="px-6 pt-12">
          <h1 className="text-3xl font-semibold leading-tight">
            All set.
          </h1>
          <p className="text-base text-gray-400 mt-2">
            Your vehicle issue has been resolved successfully.
          </p>
        </div>

        {/* SUCCESS VISUAL */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl"></div>
            <div className="relative w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-black text-5xl font-bold">✓</span>
            </div>
          </div>

          <p className="text-xl font-medium mb-2">
            Payment confirmed
          </p>

          <p className="text-sm text-gray-400 max-w-[280px]">
            ₹{repair?.diagnosis?.pricing?.total} has been securely processed.
            Thanks for choosing a smoother way to get back on the road.
          </p>
        </div>

        {/* RATING */}
        <div className="px-6">
          <p className="text-sm text-gray-400 mb-3 text-center">
            How was your overall experience?
          </p>

          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl transition-all duration-200 ${
                  rating >= star
                    ? "text-yellow-400 scale-110"
                    : "text-gray-700"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="px-6 pb-8">
          <button
            onClick={submitRating}
            disabled={!rating || submitting}
            className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg disabled:opacity-50"
          >
            {submitting ? "Saving feedback…" : "Done"}
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full mt-4 py-3 text-sm text-gray-500"
          >
            Skip feedback and go home
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserCompleted;
