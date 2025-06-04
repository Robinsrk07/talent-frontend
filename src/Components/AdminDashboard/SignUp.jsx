import { useState } from "react";
import Logo from "../../assets/Logo-dark.png";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.svg";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/signup`, formData, {
        withCredentials: true
      });

      setSuccessMessage('User created successfully!');
      setErrorMessage('');
      console.log('Signup success:', response.data);

      setTimeout(() => {
        navigate('/admin/login'); 
      }, 1500);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Signup failed';
      setErrorMessage(msg);
      setSuccessMessage('');
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

      <div className="w-full h-screen sm:w-[35%] bg-white p-4 sm:p-6 md:p-8 lg:p-9">
        <div className="flex items-center gap-2 mt-16 text-semibold text-gray-700 text-2xl">
          Sign up for Talent Admin
        </div>
        <h5 className="font-light text-gray-600 mt-2">
          Please fill in the details to create your account
        </h5>

        {errorMessage && (
          <div className="mt-4 bg-red-300 text-white font-semibold py-2 px-4 rounded shadow">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 bg-green-400 text-white font-semibold py-2 px-4 rounded shadow">
            {successMessage}
          </div>
        )}

        {['name', 'email', 'username', 'password'].map((field, idx) => (
          <div className="relative w-full mt-6" key={idx}>
            <label
              htmlFor={field}
              className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 z-10"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          className="bg-[#8C57FF] rounded-lg w-full h-[40px] mt-8 text-white font-semibold"
          onClick={handleSubmit}
        >
          Create Account
        </button>

        <div className="flex justify-center items-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-purple-600 hover:underline font-medium ml-1">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;