import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCarBattery,
  FaTools,
  FaGasPump,
  FaKey,
  FaExclamationTriangle,
  FaMapMarkerAlt,
} from "react-icons/fa";

const issues = [
  { id: "Battery Dead", icon: FaCarBattery },
  { id: "Tyre Puncture", icon: FaTools },
  { id: "Fuel Issue", icon: FaGasPump },
  { id: "Engine Trouble", icon: FaExclamationTriangle },
  { id: "Key Locked", icon: FaKey },
  { id: "Not Sure", icon: FaTools },
];

export default function RepairCallPanel({ onContinue }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [priority, setPriority] = useState("normal");
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("Please allow location access");
      }
    );
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-black text-white">
      {/* 🗺️ MAP / IMAGE SECTION (TOP HALF) */}
      <div className="relative h-[45vh] w-full">
        {/* Map placeholder image */}
        <img
          src="https://maps.googleapis.com/maps/api/staticmap?center=Hyderabad&zoom=14&size=600x400&maptype=roadmap"
          alt="map"
          className="h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Location chip */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-xl p-3 flex items-center gap-2">
          <FaMapMarkerAlt className="text-yellow-400" />
          <span className="text-sm text-gray-200">
            Near LB Nagar Flyover, Hyderabad
          </span>
        </div>
      </div>

      {/* 🔧 BOTTOM PANEL */}
      <div className="flex-1 bg-black rounded-t-3xl p-6 flex flex-col justify-between -mt-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold">🔧 Repair Call</h2>
          <p className="text-gray-400 text-sm">
            A mechanic will come to your exact location
          </p>
        </div>

        {/* Issue Selection */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {issues.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedIssue(id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border 
                ${
                  selectedIssue === id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-gray-700"
                }`}
            >
              <Icon className="text-xl mb-2" />
              <span className="text-xs text-center">{id}</span>
            </button>
          ))}
        </div>

        {/* Priority */}
        <div className="flex gap-3 mt-4">
          {["normal", "high"].map((level) => (
            <button
              key={level}
              onClick={() => setPriority(level)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium
                ${
                  priority === level
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-gray-300"
                }`}
            >
              {level === "high" ? "🚨 High Priority" : "Normal"}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            if (!selectedIssue) return;

            navigate("/repair/details", {
              state: {
                issue: selectedIssue,
                priority,
                location,
              },
            });
          }}
          disabled={!selectedIssue}
          className={`mt-4 py-3 rounded-xl font-semibold
    ${
      selectedIssue
        ? "bg-yellow-400 text-black"
        : "bg-gray-700 text-gray-400 cursor-not-allowed"
    }`}
        >
          Request Mechanic • ETA 8–12 mins
        </button>
      </div>
    </div>
  );
}
