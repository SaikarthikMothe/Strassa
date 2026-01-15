import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  const [earnings, setEarnings] = React.useState(null);
  const navigate = useNavigate();

  console.log("captain.firstname:", captain.fullname);
  return (
    <div>
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center justify-start gap-5">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1463453091185-61582044d556?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
          />
          <h4 className="text-lg font-medium capitalize">
            {captain?.fullname?.firstname || "Captain"}
          </h4>
        </div>
        <div className="text-right">
          <h4 className="text-xl font-semibold"></h4>
          <p className="text-sm text-gray-600">
            <div
              onClick={() => navigate("/captain/earnings")}
              className="cursor-pointer"
            >
              <p className="text-xl font-bold">
                ₹{earnings?.totalEarnings ?? 0}
              </p>
              <p className="text-gray-500 underline">Total Earnings</p>
            </div>
          </p>
        </div>
      </div>
      <div className="flex p-3 mt-6 rounded-xl bg-gray-100 justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
          <h5 className="text-lg font-medium ">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">10.2</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
