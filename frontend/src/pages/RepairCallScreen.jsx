// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { SocketContext } from "../context/SocketContext";

// import RepairCallPanel from "./RepairCallPanel";
// import RepairDetailsForm from "../components/RepairDetailsForm";
// import SearchingMechanic from "../components/SearchingMechanic";
// import MapPlaceholder from "./MapPlaceholder";
// import SearchRadiusOverlay from "../components/SearchRadiusOverlay";
// import MechanicAssigned from "../components/MechanicAssigned";
// import MechanicEnRoute from "../components/MechanicEnRoute";
// import RepairCompleted from "../components/RepairCompleted";
// import RateMechanic from "../components/RateMechanic";

// const STEPS = {
//   REQUEST: "request",
//   DETAILS: "details",
//   SEARCHING: "searching",
//   ASSIGNED: "assigned",
//   ENROUTE: "enroute",
//   COMPLETED: "completed",
//   RATING: "rating",
// };

// export default function RepairCallScreen() {
//   const [step, setStep] = useState(STEPS.REQUEST);
//   const [loading, setLoading] = useState(false);
//   const [selectedIssue, setSelectedIssue] = useState("");
//   const [assignedCaptain, setAssignedCaptain] = useState(null);
//   const [location, setLocation] = useState(null);
//   const { socket } = useContext(SocketContext);

//   const handleContinue = async (form) => {
//     const isNotSure = selectedIssue === "Not Sure";

//     try {
//       setLoading(true);

//       await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/repair/create`,
//         {
//           issue: isNotSure ? "Issue not specified" : selectedIssue,
//           notes: isNotSure
//             ? `User unsure. Description: ${form.problem}`
//             : form.notes,
//           vehicleType: form.vehicleType,
//           make: form.make,
//           model: form.model,
//           vehicleNumber: form.vehicleNumber,
//           location: location,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setStep(STEPS.SEARCHING);
//     } catch (err) {
//       console.error("❌ Axios message:", err.message);
//       console.error("❌ Status:", err.response?.status);
//       console.error("❌ Data:", err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* 📍 Get location */
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       () => {
//         alert("Please allow location access");
//       }
//     );
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("repair-assigned", (data) => {
//       console.log("✅ repair-assigned received:", data);
//       setStep(STEPS.ASSIGNED);
//       setAssignedCaptain(data.captain);
//     });

//     return () => socket.off("repair-assigned");
//   }, [socket]);

//   // FULL PAGE FORM
//   if (step === STEPS.DETAILS) {
//     return (
//       <RepairDetailsForm
//         initialIssue={selectedIssue}
//         onContinue={handleContinue}
//       />
//     );
//   }

//   return (
//     <div className="relative h-screen w-full overflow-hidden">
//       <div className="absolute inset-0">
//         <MapPlaceholder />
//       </div>

//       {step === STEPS.SEARCHING && <SearchRadiusOverlay />}
//       {step === STEPS.REQUEST && (
//         <RepairCallPanel
//           onContinue={({ issue }) => {
//             setSelectedIssue(issue);
//             setStep(STEPS.DETAILS);
//           }}
//         />
//       )}

//       {step === STEPS.SEARCHING && <SearchingMechanic loading={loading} />}
//       {step === STEPS.ASSIGNED && 
//       <MechanicAssigned  captain = {assignedCaptain}/>}
//       {step === STEPS.ENROUTE && <MechanicEnRoute />}
//       {step === STEPS.COMPLETED && <RepairCompleted />}
//       {step === STEPS.RATING && <RateMechanic />}
//     </div>
//   );
// }
