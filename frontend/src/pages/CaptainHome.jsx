import axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import FuelPopUp from "../components/FuelPopUp";
import { useNavigate } from "react-router-dom";
import IncomingJobPopup from "../components/IncomingJobPopup";
import CaptainTowingRequest from "../components/CaptainTowingRequest";
const CaptainHome = () => {
  const [ridePopupPanel, setridePopupPanel] = useState(false);
  const [confirmridePopupPanel, setconfirmridePopupPanel] = useState(false);
  const [fuelPopupPanel, setFuelPopupPanel] = useState(false);
  const [fuelRequest, setFuelRequest] = useState(null);
  const fuelPopupPanelRef = useRef(null);
  const ridePopupPanelRef = useRef(null);
  const confirmridePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [activeFuelRequest, setActiveFuelRequest] = useState(null);
  const [delivering, setDelivering] = useState(false);
  const [incomingJob, setIncomingJob] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeJobRequest, setActiveJobRequest] = useState(null);
  const [activeRepair, setActiveRepair] = useState(null);
  const [towingRequest, setTowingRequest] = useState(null);
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!socket || !captain?._id) return;

    const joinCaptain = () => {
      console.log("🚗 Captain joining socket:", socket.id);
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });
    };

    // If already connected
    if (socket.connected) {
      joinCaptain();
    }

    // For reconnects
    socket.on("connect", joinCaptain);

    return () => {
      socket.off("connect", joinCaptain);
    };
  }, [socket, captain?._id]);

  useEffect(() => {
    if (!captain?._id || !socket) return;

    const watchId = navigator.geolocation.watchPosition((pos) => {
      socket.emit("update-location-captain", {
        userId: captain._id,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [captain?._id, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("🔥🔥 NEW RIDE RECEIVED:", data);
      setRide(data);
      setridePopupPanel(true);
    };

    socket.on("new-ride-request", handleNewRide);

    return () => {
      socket.off("new-ride-request", handleNewRide);
    };
  }, [socket]);

  async function confirmRide() {
    if (!ride?.rideId) return;

    console.log("📞 Calling /rides/confirm with:", ride.rideId);

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride.rideId.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setridePopupPanel(false);
    setconfirmridePopupPanel(true);
  }

  useEffect(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [ridePopupPanel]);

  useEffect(() => {
    if (confirmridePopupPanel) {
      gsap.to(confirmridePopupPanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmridePopupPanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [confirmridePopupPanel]);

  useEffect(() => {
    if (!socket) return;

    const handlePaymentSuccess = ({ rideId }) => {
      console.log("💰 Payment received for ride:", rideId);
      navigate(`/captain/ride-summary/${rideId}`);
    };

    socket.on("payment-success", handlePaymentSuccess);

    return () => {
      socket.off("payment-success", handlePaymentSuccess);
    };
  }, [socket, navigate]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/earnings/captain`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEarnings(res.data);
      } catch (err) {
        console.error("Failed to load earnings", err);
      }
    };

    fetchEarnings();
  }, []);
  /*---------------Fuel Sockets------------------*/

  useEffect(() => {
    if (!socket) return;

    const handleFuelRequest = (data) => {
      if (ride || activeFuelRequest) {
        console.log("⛽ Ignoring fuel request, busy");
        return;
      }

      setFuelRequest(data);
      setFuelPopupPanel(true);
    };

    socket.on("new-fuel-request", handleFuelRequest);
    return () => socket.off("new-fuel-request", handleFuelRequest);
  }, [socket, ride, activeFuelRequest]);

  const acceptFuel = async () => {
    if (!fuelRequest) return;

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/fuel/accept`,
      { fuelRequestId: fuelRequest.fuelRequestId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setActiveFuelRequest(fuelRequest);
    setFuelRequest(null);
    setFuelPopupPanel(false);
  };

  useEffect(() => {
    if (!fuelPopupPanelRef.current) return;

    gsap.to(fuelPopupPanelRef.current, {
      y: fuelPopupPanel ? 0 : "100%",
      duration: 0.5,
      ease: "power2.out",
    });
  }, [fuelPopupPanel]);

  const markFuelDelivered = async () => {
    if (!activeFuelRequest?.fuelRequestId || delivering) return;

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/fuel/deliver`,
      { fuelRequestId: activeFuelRequest.fuelRequestId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },

      setActiveFuelRequest(null),
      setDelivering(false)
    );
  };
  /*-------------Repair <sockets----------------*/
  useEffect(() => {
    if (!socket) return;

    const handleJobRequest = (data) => {
      // Captain already busy
      if (ride || activeJobRequest) {
        console.log("❌ Ignoring Job, captain busy");
        return;
      }

      console.log("📥 New Job Request:", data);
      setIncomingJob(data);
      setShowPopup(true);
    };

    socket.on("new-job-request", handleJobRequest);

    return () => {
      socket.off("new-job-request", handleJobRequest);
    };
  }, [socket, ride, activeJobRequest, captain]);

  const handleAccept = () => {
    console.log("✅ Job Accepted:", incomingJob);

    setActiveJobRequest(incomingJob);
    setShowPopup(false);

    // Later → call backend /jobs/accept here
  };

  const handleReject = () => {
    console.log("❌ Job Rejected");
    setIncomingJob(null);
    setShowPopup(false);
  };
  useEffect(() => {
    if (!socket) return;

    const handleRepairApproved = (data) => {
      console.log("✅ Repair approved by user:", data);

      // Directly set active repair from socket payload
      setActiveRepair({
        _id: data.repairId,
        status: "APPROVED",
        issue: data.issue,
        diagnosis: data.diagnosis,
      });
    };

    socket.on("repair-approved", handleRepairApproved);

    return () => {
      socket.off("repair-approved", handleRepairApproved);
    };
  }, [socket]);

  /*---------Towing sockets-------------*/
  useEffect(() => {
    if (!socket) return;

    console.log("✅ Socket is available:", socket.id);
    console.log("📡 Listening for new-towing-request event");
    
    const onNewTowing = (data) => {
      console.log("🚛 NEW TOWING REQUEST:", data);
      setTowingRequest(data);
    };

    const onCancelled = ({ towingId }) => {
      if (towingRequest?.towingId === towingId) {
        setTowingRequest(null);
      }
    };

    socket.on("new-towing-request", onNewTowing);
    socket.on("towing-cancelled", onCancelled);

    return () => {
      socket.off("new-towing-request", onNewTowing);
      socket.off("towing-cancelled", onCancelled);
    };
  }, [socket, towingRequest]);

  // In CaptainHome.jsx, add this useEffect for polling:

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-50 bg-white ">
        <img
          className="w-16"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt=""
        />
        <Link
          to="/home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full translate-y-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <RidePopUp
          ride={ride}
          setridePopupPanel={setridePopupPanel}
          setconfirmridePopupPanel={setconfirmridePopupPanel}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmridePopupPanelRef}
        className="fixed w-full h-screen translate-y-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setconfirmridePopupPanel={setconfirmridePopupPanel}
          setridePopupPanel={setridePopupPanel}
        />
      </div>

      {/* Fuel Request Popup */}
      <div
        ref={fuelPopupPanelRef}
        className="fixed w-full translate-y-full z-40 bottom-0 bg-white px-3 py-6 pt-12"
      >
        {fuelRequest && (
          <FuelPopUp
            fuelRequest={fuelRequest}
            onAccept={acceptFuel}
            onClose={() => setFuelPopupPanel(false)}
          />
        )}
      </div>

      {activeFuelRequest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-50">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          <h3 className="text-xl font-semibold mb-1">
            ⛽ Fuel delivery in progress
          </h3>

          <p className="text-gray-500 mb-6">
            Head to the user’s location and deliver fuel
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Fuel</span>
              <span className="font-medium">{activeFuelRequest.fuelType}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">
                {activeFuelRequest.quantity} L
              </span>
            </div>
          </div>

          <button
            onClick={markFuelDelivered}
            disabled={delivering}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-medium disabled:opacity-50"
          >
            {delivering ? "Updating..." : "Mark delivered"}
          </button>
        </div>
      )}

      {showPopup && incomingJob && (
        <IncomingJobPopup
          job={incomingJob}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {activeRepair && activeRepair.status === "APPROVED" && (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-slideUp">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">🔧</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Active Repair</h3>
                  <p className="text-black/80 text-sm">
                    Repair approved by user
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveRepair(null)}
                className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm line-clamp-2">
                {activeRepair.issue || "Vehicle repair in progress"}
              </p>
              {activeRepair.diagnosis?.pricing?.total && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Estimated Total:</span>
                  <span className="font-bold">
                    ₹{activeRepair.diagnosis.pricing.total}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate(`/captain/repair/outcome/${activeRepair._id}`)
                }
                className="flex-1 py-3 bg-black text-yellow-500 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
              >
                Decide Outcome
              </button>
              <button
                onClick={() =>
                  navigate(`/captain/repair/details/${activeRepair._id}`)
                }
                className="flex-1 py-3 bg-black/20 text-black rounded-xl font-medium hover:bg-black/30 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {towingRequest && (
        <CaptainTowingRequest
          request={towingRequest}
          onClose={() => setTowingRequest(null)}
        />
      )}
    </div>
  );
};

export default CaptainHome;
