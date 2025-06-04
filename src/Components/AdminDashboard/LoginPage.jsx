import { useState } from "react";
import Logo from "../../assets/Logo-dark.png"
import  image1 from "../../assets/image1.png"
import  image2 from "../../assets/image2.svg"
import { Link, useNavigate } from 'react-router-dom';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import axios from 'axios'




const LoginPage = () => {
  const navigate  =useNavigate()
  
const [username,setUsername]= useState('')
const [password,setPassword]= useState('')
const [errorMessage,setErrorMesage] =useState(false)



 const handleSubmit = async () => {
  
  try {
    const response =await axios.post(`${VITE_API_BASE_URL}/login`, {
        username,
        password,
      }, {
        withCredentials: true
      });
    const data = response.data;

    // Handle success
    console.log('Login success:', data);

    // If backend returns a token or user info, store it
    // Redirect after login
   navigate('/admin/dashboard/scroll', { replace: true });
  
  } catch (error) {

    setErrorMesage(true)
    setTimeout(()=>    setErrorMesage(false),3000
    )
    // Handle error response
    console.error('Login failed:', error?.response?.data?.message || error.message);
    
  }
};

  
  return (
    <div className="flex flex-col sm:flex-row">
              <div
                className="hidden sm:block sm:w-[65%] h-screen bg-[#F4F5FA] relative bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: `url(${image2})` }}
              >
              <div className="absolute top-0 left-0 p-2 md:p-12 flex items-center space-x-2">
                <img className="w-8 h-8" src={Logo} alt="Logo" />
                <h2 className="font-semibold text-2xl">TALENT</h2>
              </div>

              <div className="absolute bottom-0 left-0 p-2">
                <img className="w-40 h-40" src={image1} alt="Icon" />
              </div>
            </div>

      
      <div className="w-full h-screen sm:w-[35%] bg-white p-4 sm:p-6 md:p-8 lg:p-9  ">

       <div className="flex items-center gap-2 mt-16 text-semibold text-gray-700 text-2xl">
       Welcome to Talent Admin
       <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
       <path d="M80 104c0-22.1-17.9-40-40-40S0 81.9 0 104l0 56 0 64L0 325.5c0 25.5 10.1 49.9 28.1 67.9L128 493.3c12 12 28.3 18.7 45.3 18.7l66.7 0c26.5 0 48-21.5 48-48l0-78.9c0-29.7-11.8-58.2-32.8-79.2l-25.3-25.3c0 0 0 0 0 0l-15.2-15.2-32-32c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l32 32 15.2 15.2c11 11 9.2 29.2-3.7 37.8c-9.7 6.5-22.7 5.2-31-3.1L98.7 309.5c-12-12-18.7-28.3-18.7-45.3L80 224l0-80 0-40zm480 0l0 40 0 80 0 40.2c0 17-6.7 33.3-18.7 45.3l-51.1 51.1c-8.3 8.3-21.3 9.6-31 3.1c-12.9-8.6-14.7-26.9-3.7-37.8l15.2-15.2 32-32c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-32 32-15.2 15.2c0 0 0 0 0 0l-25.3 25.3c-21 21-32.8 49.5-32.8 79.2l0 78.9c0 26.5 21.5 48 48 48l66.7 0c17 0 33.3-6.7 45.3-18.7l99.9-99.9c18-18 28.1-42.4 28.1-67.9L640 224l0-64 0-56c0-22.1-17.9-40-40-40s-40 17.9-40 40z" />
       </svg>
      </div>   
       

         <h5 className="font-light text-gray-600 mt-2">Please sign-in to your account</h5>
          <div
        className={`transition-all w-full  duration-500  ease-in-out transform ${
          errorMessage
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 h-[0px] pointer-events-none"
        }`}
      >
        <div className=" bg-red-300 h-[30px] m-1 text-white flex justify-center items-center font-semibold rounded shadow">
          Invalid Credentials
        </div>
      </div>

       
       <div className="relative w-full mt-6">
            <label
                htmlFor="email"
                className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 z-10"
            >
                Username
            </label>
            <input
                type="text"
                name="username"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>setUsername(e.target.value)}
            />
          </div>
       <div className="relative w-full mt-6">
            <label
                htmlFor="email"
                className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 z-10"
            >
                Password
            </label>
            <input
                type="password"
                name="password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-bg-[#8C57FF]"
                onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <div className="flex font-semibold text-gray-700 items-center mt-6 justify-between text-sm">
            {/* Remember Me */}
            <label className="flex items-center space-x-2">
                <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600 rounded-md accent-purple-600"
                defaultChecked
                />
                <span className="text-gray-600">Remember me</span>
            </label>

            {/* Forgot Password */}
            <a href="#" className="text-purple-600 hover:underline">
                Forgot password?
            </a>
            </div>
            <button className="bg-[#8C57FF] rounded-lg w-full h-[37px] mt-12" onClick={handleSubmit}> Log In</button>

            <div className=" flex justify-center items-center text-sm text-gray-700 mt-6 ">
            New on our platform?{" "}
            
            <Link to='/admin/signup' className="text-purple-600 hover:underline font-medium">Create an account</Link>
            </div>
      </div>
    </div>
  )
}

export default LoginPage