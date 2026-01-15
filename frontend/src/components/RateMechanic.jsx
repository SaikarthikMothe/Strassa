import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const RateMechanic = () => {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (rating === 0) return

    setSubmitted(true)

    // simulate save + UX pause
    setTimeout(() => {
      navigate("/repair-call") // or your service selection route
    }, 1200)
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      className="fixed inset-0 bg-black z-40 flex items-center justify-center"
    >
      <div className="w-full px-6 text-white text-center">

        {!submitted ? (
          <>
            <div className="text-3xl mb-3">👨‍🔧</div>

            <h2 className="text-lg font-semibold mb-1">
              Rate your mechanic
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              How was your experience?
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                rating === 0
                  ? "bg-gray-700 text-gray-400"
                  : "bg-yellow-400 text-black"
              }`}
            >
              Submit Rating
            </button>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-lg font-semibold mb-2">
              Thanks for your feedback
            </h2>
            <p className="text-gray-400 text-sm">
              Redirecting you back…
            </p>
          </>
        )}

      </div>
    </motion.div>
  )
}

export default RateMechanic
