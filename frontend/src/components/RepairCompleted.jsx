import { motion } from "framer-motion"

const RepairCompleted = ({ onContinue }) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black rounded-t-3xl z-30"
    >
      <div className="px-6 py-6 text-white text-center">

        <div className="text-3xl mb-3">✅</div>

        <h2 className="text-lg font-semibold mb-1">
          Repair completed
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Your vehicle is ready to go
        </p>

        <button
          onClick={onContinue}
          className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-xl"
        >
          Rate Mechanic
        </button>

      </div>
    </motion.div>
  )
}

export default RepairCompleted
