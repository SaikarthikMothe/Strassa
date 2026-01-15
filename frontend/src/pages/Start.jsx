import React from 'react'
import {Link} from 'react-router-dom'
const Start = () => {
    console.log('Home component rendered');
    return (
        <div>
            <div className='bg-center bg-cover bg-[url(https://media.istockphoto.com/id/1061183046/photo/new-york-5th-avenue-traffic-in-the-evening.jpg?s=612x612&w=0&k=20&c=SQ3cKG14HGrFX_jW2u8Y-zTqrmEORmHZQ7Wkd60d97M=)] h-screen pt-8 flex justify-between flex-col w-full bg-red-500'>
                <img className='w-14 ml-8'src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png " alt="" />
                <div className='bg-white pb-7 py-4 px-4'>
                    <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
                    <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
                </div>
            </div>
        </div>
    )
}

export default Start