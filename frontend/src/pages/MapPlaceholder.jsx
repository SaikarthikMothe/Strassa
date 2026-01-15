export function MapPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
      <div className="text-center text-white opacity-80">
        <div className="location-wrapper">
          <span className="pin-pulse" />
          <div className="location-pin">📍</div>
        </div>

        <p className="text-sm">Your current location</p>
      </div>
    </div>
  );
}

export default MapPlaceholder;
