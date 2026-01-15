import { useEffect, useState } from "react";
import axios from "axios";

const PostRidePanel = ({ rideId, onExit }) => {
  const [ride, setRide] = useState(null);
  const [paid, setPaid] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch ride details
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/${rideId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRide(res.data);
      } catch (err) {
        console.error("Failed to fetch ride:", err);
      }
    };

    fetchRide();
  }, [rideId]);

  // Handle payment (CASH)
  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/pay-cash`,
        { rideId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPaid(true); // unlock rating step
    } catch (err) {
      console.error(
        "Payment failed:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit rating
  const submitRating = async () => {
    if (!rating) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/rate-captain`,
        { rideId, rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error(
        "Rating failed:",
        err.response?.data || err.message
      );
    } finally {
      onExit(); // go home after rating
    }
  };

  if (!ride) {
    return <div className="p-6">Loading trip summary...</div>;
  }

  return (
    <div className="h-screen bg-white p-6 flex flex-col justify-between">
      {/* TOP */}
      <div>
        <h2 className="text-2xl font-semibold">Trip Completed</h2>
        <p className="text-gray-500 mt-1">
          Thanks for riding with us
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span>Fare</span>
            <strong>₹{ride.fare}</strong>
          </div>

          <div className="flex justify-between">
            <span>Payment Mode</span>
            <strong>CASH</strong>
          </div>

          <div className="flex justify-between">
            <span>Driver</span>
            <strong>
              {ride.captain?.fullname?.firstname}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Pickup</span>
            <strong className="text-right">
              {ride.pickup}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Drop</span>
            <strong className="text-right">
              {ride.destination}
            </strong>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div>
        {/* PAYMENT STEP */}
        {!paid && (
          <button
            disabled={loading}
            onClick={handlePayment}
            className="w-full bg-black text-white py-3 rounded-lg text-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ₹${ride.fare}`}
          </button>
        )}

        {/* RATING STEP */}
        {paid && (
          <>
            <p className="text-center mt-4 text-gray-600">
              Rate your driver (optional)
            </p>

            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              disabled={!rating}
              onClick={submitRating}
              className="w-full bg-black text-white py-3 rounded-lg mb-2 disabled:opacity-50"
            >
              Submit Rating
            </button>

            <button
              onClick={onExit}
              className="w-full text-gray-500"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostRidePanel;
