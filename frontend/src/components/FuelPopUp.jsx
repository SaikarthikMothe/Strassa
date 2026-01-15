import React from "react";

const FuelPopUp = ({ fuelRequest, onAccept, onClose }) => {
  if (!fuelRequest) return null;

  const openInMaps = () => {
    if (!fuelRequest.location) return;
    const { lat, lng } = fuelRequest.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-[0_-16px_32px_rgba(0,0,0,0.15)] px-6 py-5 max-h-[55vh] overflow-y-auto">

      {/* Drag Handle */}
      <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

      {/* Title */}
      <h2 className="text-lg font-semibold">
        Fuel delivery request
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Nearby customer needs fuel
      </p>

      {/* Earnings */}
      <div className="flex items-center justify-between bg-gray-100 rounded-2xl px-4 py-3 mb-4">
        <span className="text-sm text-gray-600">Earnings</span>
        <span className="text-xl font-semibold text-black">
          ₹{fuelRequest.totalAmount}
        </span>
      </div>

      {/* Fuel details */}
      <div className="bg-gray-50 rounded-2xl px-4 py-3 space-y-3 mb-4">
        <InfoRow label="Fuel type" value={fuelRequest.fuelType} />
        <InfoRow label="Quantity" value={`${fuelRequest.quantity} L`} />
      </div>

      {/* Location */}
      {fuelRequest.address && (
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">
            📍 Delivery location
          </p>

          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <p className="text-sm text-gray-800 leading-snug mb-3 line-clamp-2">
              {fuelRequest.address}
            </p>

            <button
              onClick={openInMaps}
              className="flex items-center gap-2 text-sm font-medium text-black"
            >
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white shadow">
                🗺️
              </span>
              Open in Maps
            </button>
          </div>
        </div>
      )}

      {/* Primary action */}
      <button
        onClick={onAccept}
        className="w-full bg-black text-white py-3.5 rounded-2xl text-base font-medium active:scale-[0.98] transition"
      >
        Accept delivery
      </button>

      {/* Secondary */}
      <button
        onClick={onClose}
        className="w-full mt-2 py-3 text-sm text-gray-500"
      >
        Ignore
      </button>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default FuelPopUp;
