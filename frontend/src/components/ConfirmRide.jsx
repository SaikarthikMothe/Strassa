import React from "react";

const ConfirmRide = (props) => {
    return (
     <div>
            <h5 className="p-1 top-0 text-center absolute w-[93%]" onClick={()=>{
          props.setConfirmRidePanel(false);
        }}><i className="text-3xl ri-arrow-down-wide-fill"></i></h5>
        <h3 className="text-2xl font-semibold mb-5">Confirm the Ride</h3>
        <div className="flex gap-2 justify-between flex-col items-center">
          <img className="h-20" src=" https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
        
        <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-small text-gray-600 -mt-1">{props.pickup}</p>
            </div>
        </div>
        <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-small text-gray-600 -mt-1">{props.destination}</p>
            </div>
        </div>
        <div className="flex items-center gap-5 p-3">
            <i className="ri-money-dollar-circle-fill"></i>
            <div>
                <h3 className="text-lg font-medium">₹{props.fare[props.vehicleType]}</h3>
                <p className="text-small text-gray-600 -mt-1">cash cash</p>
            </div>
            </div>
        </div>
            <button onClick={()=>{
                props.createRide()
                props.setVehicleFound(true)
                props.setConfirmRidePanel(false)
            }}className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">Confirm</button>
        </div>
      </div> 
    );
};

export default ConfirmRide;
