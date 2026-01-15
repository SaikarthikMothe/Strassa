const FuelRequestPopup = ({ fuelRequest, onAccept, onIgnore }) => {

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-2">
        ⛽ Fuel Request
      </h2>

      <p className="text-gray-500 mb-4">
        Emergency fuel delivery nearby
      </p>

      <div className="space-y-2 text-sm">
        <p><b>Fuel:</b> {fuelRequest.fuelType}</p>
        <p><b>Quantity:</b> {fuelRequest.quantity} L</p>
        <p><b>Amount:</b> ₹{fuelRequest.totalAmount}</p>
      </div>

      <button
        onClick={onAccept}
        className="w-full bg-black text-white py-3 rounded-xl mt-5"
      >
        Accept Fuel Request
      </button>

      <button
        onClick={onIgnore}
        className="w-full bg-gray-100 py-3 rounded-xl mt-2"
      >
        Ignore
      </button>
    </div>
  );
};

export default FuelRequestPopup;