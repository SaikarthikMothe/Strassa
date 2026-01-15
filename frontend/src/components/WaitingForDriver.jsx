import React from "react";
const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        className="p-1 top-0 text-center absolute w-[93%]"
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
      >
        <i className="text-3xl ri-arrow-down-wide-fill"></i>
      </h5>

      <div className="flex items-center justify-between">
        <img
          className="h-12"
          src=" https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.captain?.fullname?.firstname || "Driver"}
          </h2>

          <h4 className="text-xl font-semibold -mt-2 -mb-1">
            {props.ride?.captain?.vehicle?.plate || "—"}
          </h4>

          <p className="text-sm text-gray-600">Hyundai Creta</p>
          <h5 className="text-lg font-semibold">{props.ride?.otp}</h5>
        </div>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-small text-gray-600 -mt-1">
                {props.ride?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-small text-gray-600 -mt-1">
                {props.ride?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-money-dollar-circle-fill"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-small text-gray-600 -mt-1">cash cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
