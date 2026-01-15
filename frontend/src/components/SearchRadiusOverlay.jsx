import "../cssFiles/SearchRadiusOverlay.css";
const SearchRadiusOverlay = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        {/* Pulsing circles */}
        <span className="pulse-ring"></span>
        <span className="pulse-ring delay-1"></span>
        <span className="pulse-ring delay-2"></span>

        {/* Center icon */}
        <div className="location-pulse" />

        <div className="mechanic-dot dot-1" />
        <div className="mechanic-dot dot-2" />
        <div className="mechanic-dot dot-3" />
      </div>
    </div>
  );
};

export default SearchRadiusOverlay;
