import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaArrowRight,
  FaTimesCircle,
} from "react-icons/fa";

const RepairTowingOffer = () => {
  const { repairId } = useParams();
  const navigate = useNavigate();

  const requestTowing = () => {
    navigate("/towing");
  };

  const skipTowing = () => {
    navigate("/home");
  };

  return (
    <div className="h-screen bg-black flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] flex flex-col px-5 py-8 text-white"
      >
        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <FaTruck className="text-yellow-400 text-2xl" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Need towing assistance?
        </h1>

        <p className="text-gray-400 text-center mb-6 text-sm">
          Your vehicle may require workshop repair.  
          We can arrange towing to a nearby service center.
        </p>

        {/* INFO CARD */}
        <div className="bg-gray-900 rounded-2xl p-4 mb-8">
          <ul className="space-y-3 text-sm text-gray-300">
            <li>• Verified towing partners</li>
            <li>• Safe vehicle handling</li>
            <li>• Transparent pricing</li>
          </ul>
        </div>

        {/* PRIMARY CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={requestTowing}
          className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg flex items-center justify-center gap-2 mb-4"
        >
          Request Towing
          <FaArrowRight />
        </motion.button>

        {/* SECONDARY CTA */}
        <button
          onClick={skipTowing}
          className="w-full py-3 rounded-xl text-gray-400 text-sm flex items-center justify-center gap-2"
        >
          <FaTimesCircle />
          Skip for now
        </button>
      </motion.div>
    </div>
  );
};

export default RepairTowingOffer;
