import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div className="animate-slideUp">
            {/* Close Button */}
            <h5
                className='p-1 text-center w-[93%] absolute top-0'
                onClick={() => props.setVehiclePanel(false)}
            >
                <i className="text-3xl text-gray-300 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className='text-2xl font-semibold mb-5'>
                Choose a Vehicle
            </h3>

            {/* UberGo */}
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanel(false)
                    props.selectVehicle('car')
                }}
                className='flex border-2 hover:shadow-md transition-all duration-200 
                active:border-black active:scale-[0.98] mb-3 rounded-xl w-full 
                p-3 items-center justify-between cursor-pointer'
            >
                <img
                    className='h-10 w-14 object-contain'
                    src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                    alt=""
                />

                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base flex items-center'>
                        UberGo
                        <span className='ml-2 text-xs bg-black text-white px-2 py-0.5 rounded'>
                            Recommended
                        </span>
                    </h4>
                    <h5 className='font-medium text-sm'>2 mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>
                        Best for everyday trips
                    </p>
                </div>

                <h2 className='text-lg font-semibold'>
                    ₹{props.fare.car}
                </h2>
            </div>

            {/* Moto */}
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanel(false)
                    props.selectVehicle('motorcycle')
                }}
                className='flex border-2 hover:shadow-md transition-all duration-200 
                active:border-black active:scale-[0.98] mb-3 rounded-xl w-full 
                p-3 items-center justify-between cursor-pointer'
            >
                <img
                    className='h-10 w-14 object-contain'
                    src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
                    alt=""
                />

                <div className='-ml-2 w-1/2'>
                    <h4 className='font-medium text-base flex items-center'>
                        Moto
                        <span className='ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded'>
                            Cheapest
                        </span>
                    </h4>
                    <h5 className='font-medium text-sm'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>
                        Fastest in traffic
                    </p>
                </div>

                <h2 className='text-lg font-semibold'>
                    ₹{props.fare.motorcycle}
                </h2>
            </div>

            {/* Auto */}
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanel(false)
                    props.selectVehicle('auto')
                }}
                className='flex border-2 hover:shadow-md transition-all duration-200 
                active:border-black active:scale-[0.98] mb-3 rounded-xl w-full 
                p-3 items-center justify-between cursor-pointer'
            >
                <img
                    className='h-10 w-14 object-contain'
                    src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
                    alt=""
                />

                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>
                        UberAuto
                    </h4>
                    <h5 className='font-medium text-sm'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-600'>
                        Budget-friendly rides
                    </p>
                </div>

                <h2 className='text-lg font-semibold'>
                    ₹{props.fare.auto}
                </h2>
            </div>

            {/* Mobile Fuel */}
            <div
                onClick={() => {
                    props.setVehiclePanel(false)
                    props.setFuelPanel(true)
                }}
                className='flex border-2 hover:shadow-md transition-all duration-200 
                active:border-black active:scale-[0.98] mb-2 rounded-xl w-full 
                p-3 items-center justify-between cursor-pointer bg-orange-50'
            >
                <img
                    className='h-10 w-14 object-contain'
                    src="https://cdn-icons-png.flaticon.com/512/3448/3448270.png"
                    alt=""
                />

                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base flex items-center'>
                        Mobile Fuel
                        <span className='ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded'>
                            Emergency
                        </span>
                    </h4>
                    <h5 className='font-medium text-sm'>
                        Fuel delivered instantly
                    </h5>
                    <p className='font-normal text-xs text-gray-600'>
                        For stranded vehicles
                    </p>
                </div>

                <h2 className='text-lg font-semibold text-orange-600'>
                    Request
                </h2>
            </div>

            {/* Intelligent Hint */}
            <p className='text-xs text-gray-500 text-center mt-2'>
                Tip: Moto is usually fastest during traffic 🚦
            </p>
        </div>
    )
}

export default VehiclePanel
