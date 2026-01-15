import React from "react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ConfirmRidePopUp = (props) => {
  const [otp, setotp] = useState("");
  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          rideId: props.ride?.rideId,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Ride started successfully:", res.data);
      props.setconfirmridePopupPanel(false);
      props.setridePopupPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    } catch (err) {
      console.error("Error starting ride:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <div>
        <h5
          className="p-1 top-0 text-center absolute w-[93%]"
          onClick={() => {
            props.setconfirmridePopupPanel(false);
          }}
        >
          <i className="text-3xl ri-arrow-down-wide-fill"></i>
        </h5>
        <h3 className="text-2xl font-semibold mb-5">
          Confirm this ride to Start
        </h3>
        <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg">
          <div className="flex items-center gap-3 mt-2">
            <img
              className="h-10 w-10 mt-1 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1463453091185-61582044d556?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D"
              alt=""
            />
            <h2 className="text-lg font-medium capitalize">
              {props.ride?.captain?.fullname?.firstname || "Driver"}
            </h2>
          </div>
          <h5 className="text-lg font-semibold">2.2KM</h5>
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

          <div className="mt-6 w-full">
            <form
              onSubmit={(e) => {
                SubmitHandler(e);
              }}
            >
              <input
                onChange={(e) => setotp(e.target.value)}
                value={otp}
                type="text"
                placeholder="Enter OTP"
                className="bg-[#eee] px-6 py-4 font-semibold text-lg rounded-lg w-full mt-2"
              />
              <button className="w-full mt-5 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg">
                Confirm
              </button>
              <button
                onClick={() => {
                  props.setconfirmridePopupPanel(false);
                  props.setridePopupPanel(false);
                }}
                className="w-full mt-2 bg-red-500 text-white font-semibold p-3 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
