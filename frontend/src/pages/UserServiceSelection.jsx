import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCar,
  FaGasPump,
  FaTruck,
  FaChevronRight,
  FaHistory,
  FaMapMarkedAlt,
  FaCreditCard,
  FaBell,
  FaSearch,
  FaCog,
  FaWallet,
  FaUserCircle,
  FaStar,
  FaShieldAlt,
  FaClock,
  FaLocationArrow,
  FaCalendarAlt,
  FaPercentage,
  FaCrown,
  FaTools
} from "react-icons/fa";
import { GiSteeringWheel, GiCarKey } from "react-icons/gi";
import { TbCarGarage } from "react-icons/tb";
import { MdElectricCar, MdLocalCarWash } from "react-icons/md";
import { motion } from "framer-motion";
import { UserDataContext } from "../context/userContext";

const UserServiceSelection = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const [activeBalance, setActiveBalance] = useState(4250);
  const [quickActions, setQuickActions] = useState([
    { id: 1, label: "Book Ride", icon: FaCar, route: "/home", color: "from-blue-500 to-blue-700", badge: "FAST" },
    { id: 2, label: "Emergency Tow", icon: FaTruck, route: "/towing", color: "from-red-500 to-red-700", badge: "24/7" },
    { id: 3, label: "Repair Call", icon: FaGasPump, route: "/repair", color: "from-orange-500 to-orange-700", badge: "30 MIN" },
    { id: 4, label: "Fuel Delivery", icon: FaGasPump, route: "/fuel", color: "from-teal-500 to-teal-700", badge: "MOBILE" },
  ]);

  const firstName = user?.fullname?.firstname || "Guest";
  const userRating = user?.rating || 4.8;

  // Recent activity mock data
  const recentActivity = [
    { id: 1, type: "ride", time: "2 hours ago", amount: "₹245", status: "completed" },
    { id: 2, type: "towing", time: "Yesterday", amount: "₹850", status: "completed" },
    { id: 3, type: "fuel", time: "3 days ago", amount: "₹1,200", status: "completed" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/App Name */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                <GiSteeringWheel className="relative text-2xl text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AutoAssist Pro
              </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors relative">
                <FaBell className="text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <FaSearch className="text-gray-300" />
              </button> */}
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-300">{firstName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span>{userRating}</span>
                  </div>
                </div>
                <FaUserCircle className="text-2xl text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome & Balance Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/30 p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
                  <p className="text-gray-400 mt-1">Ready for your next journey?</p>
                </div>
                {/* <div className="text-right">
                  <p className="text-sm text-gray-400">AutoAssist Balance</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaWallet className="text-yellow-400" />
                    <span className="text-2xl font-bold">₹{activeBalance.toLocaleString()}</span>
                    <button className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-sm font-medium transition-all">
                      + Add Funds
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaLocationArrow className="text-blue-400" />
                  Quick Actions
                </h2>
                <p className="text-sm text-gray-400">Tap to get started</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(action.route)}
                      className={`
                        relative overflow-hidden bg-gradient-to-br ${action.color}
                        rounded-2xl p-6 cursor-pointer shadow-xl
                        border border-gray-700/30
                        transition-all duration-300
                        group
                      `}
                    >
                      {/* Badge */}
                      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">
                        {action.badge}
                      </div>
                      
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
                        <Icon className="text-3xl text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold text-white mb-2">{action.label}</h3>
                      <p className="text-white/80 text-sm mb-4">
                        Get instant service at your location
                      </p>
                      
                      {/* Arrow */}
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Tap to start</span>
                        <FaChevronRight className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Service - Ride */}
            {/* <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 shadow-xl h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20">
                      <FaCar className="text-blue-400 text-xl" />
                    </div>
                    Premium Ride Service
                  </h2>
                  <span className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                    INSTANT BOOKING
                  </span>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate("/home")}
                  className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-2xl p-6 cursor-pointer border border-blue-700/30 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Book a Ride Now</h3>
                      <p className="text-gray-300 mb-4">Luxury cars • Professional drivers • Live tracking</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <FaShieldAlt className="text-green-400" />
                          <span className="text-sm text-gray-300">Insured</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-yellow-400" />
                          <span className="text-sm text-gray-300">~3 min pickup</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FaCar className="text-white text-2xl" />
                      </div>
                      <div className="absolute -right-1 -top-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <FaChevronRight className="text-black text-xs" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div> */}

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 shadow-xl h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-purple-600/20">
                      <FaHistory className="text-purple-400 text-xl" />
                    </div>
                    Recent Activity
                  </h2>
                  <button 
                    onClick={() => navigate("/history")}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'ride' ? 'bg-blue-900/30' :
                            activity.type === 'towing' ? 'bg-red-900/30' : 'bg-orange-900/30'
                          }`}>
                            {activity.type === 'ride' && <FaCar className="text-blue-400" />}
                            {activity.type === 'towing' && <FaTruck className="text-red-400" />}
                            {activity.type === 'fuel' && <FaGasPump className="text-orange-400" />}
                          </div>
                          <div>
                            <p className="font-medium text-white capitalize">{activity.type} Service</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{activity.amount}</p>
                          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Banner */}
                <div className="mt-6 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 rounded-2xl p-4 border border-yellow-700/30">
                  <div className="flex items-center gap-3">
                    <FaPercentage className="text-yellow-400 text-xl" />
                    <div>
                      <p className="text-sm font-medium text-white">20% off your next ride</p>
                      <p className="text-xs text-gray-300">Use code: RIDE20</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Services */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-500/20 to-teal-600/20">
                    <TbCarGarage className="text-teal-400 text-xl" />
                  </div>
                  Upcoming Services
                </h2>
                <p className="text-sm text-gray-400">Complete automotive care</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  // { icon: FaTools, label: "Mechanic", desc: "On-site repairs", route: "/mechanic", color: "from-red-500/20 to-red-600/20" },
                  { icon: MdLocalCarWash, label: "Car Wash", desc: "Mobile detailing", route: "/wash", color: "from-teal-500/20 to-teal-600/20" },
                  { icon: MdElectricCar, label: "EV Charge", desc: "Electric charging", route: "/ev-charge", color: "from-green-500/20 to-green-600/20" },
                  // { icon: FaCreditCard, label: "Insurance", desc: "Renewal & claims", route: "/insurance", color: "from-purple-500/20 to-purple-600/20" },
                ].map((service) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.label}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(service.route)}
                      className="bg-gray-800/50 hover:bg-gray-700/50 rounded-2xl p-5 cursor-pointer border border-gray-700/30 transition-all group"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-4`}>
                        <Icon className="text-2xl text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-1">{service.label}</h3>
                      <p className="text-sm text-gray-400 mb-3">{service.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Learn more</span>
                        <FaChevronRight className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          {/* <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-3xl p-6 border border-blue-700/30 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCrown className="text-yellow-400 text-2xl" />
                <h3 className="text-xl font-bold text-white">Upgrade to Premium</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                Get priority support, exclusive discounts, and premium vehicle options for a seamless experience.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-xl transition-all transform hover:scale-105">
                Explore Premium Plans
              </button>
            </div>
          </motion.div> */}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      {/* <div className="sticky bottom-0 z-50 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            {[
              { icon: FaCar, label: "Ride", route: "/home" },
              { icon: FaMapMarkedAlt, label: "Track", route: "/track" },
              { icon: FaWallet, label: "Wallet", route: "/wallet" },
              { icon: FaHistory, label: "History", route: "/history" },
              { icon: FaCog, label: "Settings", route: "/settings" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <item.icon />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Global Footer */}
      <div className="max-w-6xl mx-auto px-4 py-6 mt-8">
        <div className="text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-6 mb-4">
            <span className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
              <span>100% Secure</span>
            </span>
            <span className="flex items-center gap-2">
              <FaClock className="text-yellow-400" />
              <span>24/7 Support</span>
            </span>
            <span className="flex items-center gap-2">
              <FaStar className="text-blue-400" />
              <span>Rated 4.8+</span>
            </span>
          </div>
          <p>© {new Date().getFullYear()} AutoAssist Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UserServiceSelection;