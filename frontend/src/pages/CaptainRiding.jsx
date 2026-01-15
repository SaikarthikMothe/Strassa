import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking.jsx";
import { SocketContext } from "../context/SocketContext";

const CaptainRiding = () => {
  const [finishRidePanel, setfinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = React.useContext(SocketContext);
  const rideData = location.state?.ride;

  useEffect(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [finishRidePanel]);

  useEffect(() => {
  if (!socket) return;

  const handlePaymentSuccess = ({ rideId }) => {
    console.log("💰 Payment completed, navigating to summary:", rideId);
    navigate(`/captain/ride-summary/${rideId}`);
  };

  socket.on("payment-success", handlePaymentSuccess);

  return () => {
    socket.off("payment-success", handlePaymentSuccess);
  };
}, [socket, navigate]);

  return (
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen ">
        <div className="h-4/5 w-full">
          <LiveTracking />
        </div>
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        />
      </div>
      <div
        className="h-1/5 p-6 w-full relative bg-yellow-400"
        onClick={() => {
          setfinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 top-0 text-center absolute w-[93%]"
          onClick={() => {}}
        >
          <i className="text-3xl ri-arrow-down-wide-fill"></i>
        </h5>
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-semibold mt-6 ml-3">4KM Away</h5>
          <button className="bg-green-600 mt-6 mr-1 text-white font-bold p-3 px-10 rounded-lg">
            Complete Ride
          </button>
        </div>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full h-screen translate-y-full z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <FinishRide ride={rideData} setfinishRidePanel={setfinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
