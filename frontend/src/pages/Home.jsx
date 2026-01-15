import React, { useState, useRef, useEffect, useContext } from "react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import FuelRequestPanel from "../components/FuelRequestPopup.jsx";
import LookingForDriver from "../components/LookingForDriver";
import ConfirmRide from "../components/ConfirmRide";
import VehiclePanel from "../components/VehiclePanel";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate,useLocation } from "react-router-dom";
import LiveTracking from "../components/LiveTracking.jsx";
import PostRidePanel from "../components/PostRidePanel.jsx";
import AnnouncementTicker from "../components/AnnouncementTicker.jsx";
import ServiceHeroCarousel from "../components/ServiceHeroCarousel.jsx";



const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehiclefound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fuelPanel, setFuelPanel] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [showPostRide, setShowPostRide] = useState(false);
  const [postRideRideId, setPostRideRideId] = useState(null);
  const [fare, setFare] = useState({});
  const [ride, setRide] = useState(null);
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!socket || !user?._id) return;

    const joinUser = () => {
      console.log("👤 User joining socket:", socket.id);
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
    };

    // 🔑 If socket already connected
    if (socket.connected) {
      joinUser();
    }

    // 🔁 For reconnects
    socket.on("connect", joinUser);

    return () => {
      socket.off("connect", joinUser);
    };
  }, [socket, user?._id]);

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch {
      // handle error
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch {
      // handle error
    }
  };

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
      {
        params: {
          pickup: pickup,
          destination: destination,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response.data);
    setFare(response.data);
  }

  async function createRide() {
    const response = await axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: pickup,
          destination: destination,
          vehicleType: vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // setConfirmRidePanel(false);
        setVehicleFound(true);
        setWaitingForDriver(false);
      })
      .catch((error) => {
        console.error("Error creating ride:", error);
      });
  }
  // Animate the main panel
  useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
        duration: 0.5,
        ease: "power2.out",
        opacity: 1,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        duration: 0.5,
        padding: 0,
        ease: "power2.in",
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  // Animate the vehicle panel
  useEffect(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [vehiclePanel]);

  useEffect(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [confirmRidePanel]);

  useEffect(() => {
    if (vehiclefound) {
      gsap.to(vehicleFoundRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [vehiclefound]);

  useEffect(() => {
    if (waitingForDriver) {
      gsap.to(WaitingForDriverRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(WaitingForDriverRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [waitingForDriver]);

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (ride) => {
      console.log("🚗 Ride accepted by captain:", ride);
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleRideStarted = (ride) => {
      console.log("🏁 Ride started:", ride);
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
      // You can add more logic here to update the UI when the ride starts
    };
    socket.on("ride-started", handleRideStarted);
    return () => {
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket]);

  //post-ride panel
  useEffect(() => {
    if (location.state?.showPayment && location.state?.rideId) {
      // Enter post-ride mode
      setPostRideRideId(location.state.rideId);
      setShowPostRide(true);

      // cleanup navigation state so refresh doesn't retrigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-12 absolute left-4 top-4"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
        alt=""
      />
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>

      <div className="absolute flex flex-col justify-end h-screen w-full top-0">
        <div className="h-[25%] p-8 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 top-4 right-4 text-xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-fill"></i>
          </h5>
          <h4 className="text-xl font-semibold">Find a trip</h4>
          <form className="relative py-2">
            <div className="line absolute h-12 w-1 top-[50%] left-4 -translate-y-1/2 bg-gray-900 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-8 py-2 text-lg rounded-lg w-full mt-2"
              type="text"
              placeholder="Add a pick-up Location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-8 py-2 text-lg rounded-lg w-full mt-2"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-2 py-1 w-full rounded-lg"
          >
            Find Trip
          </button>
        </div>

        {/* Animated panel */}
        <div ref={panelRef} className="h-0 opacity-0 bg-white">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      {/* Vehicle Panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          setFuelPanel={setFuelPanel}
        />
      </div>

      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={WaitingForDriverRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          WaitingForDriver={WaitingForDriver}
        />
      </div>

      {showPostRide ? (
        <PostRidePanel
          rideId={postRideRideId}
          onDone={() => {
            setShowPostRide(false);
            setPostRideRideId(null);
          }}
        />
      ) : (
        <>{/* EXISTING HOME UI (booking, panels, etc.) */}</>
      )}
    </div>
  );
  
};

export default Home;
