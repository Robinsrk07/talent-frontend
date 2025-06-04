import React, { useState, useEffect } from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const ConnectUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    place: '',
    message: ''
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear status messages after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateFields = () => {
    const { name, email, contact, place, message } = formData;
    
    if (!name) return 'Name is required';
    if (!email) return 'Email is required';
    if (!email.match(/\S+@\S+\.\S+/)) return 'Invalid email format';
    if (!contact) return 'Contact number is required';
    if (!/^\d{10}$/.test(contact)) return 'Contact must be 10 digits';
    if (!place) return 'Place is required';
    if (!message) return 'Message is required';
    
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateFields();
    if (errorMsg) {
      setStatus({ type: 'error', message: errorMsg });
      return;
    }

    setLoading(true);
    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('phone', formData.contact);
    formPayload.append('place', formData.place);
    formPayload.append('message', formData.message);

    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/contact/student`, formPayload);
      
      if (response.status >= 200 && response.status < 300) {
        setStatus({ type: 'success', message: 'We will contact you shortly!' });
        setFormData({
          name: '',
          email: '',
          contact: '',
          place: '',
          message: ''
        });
      } else {
        setStatus({ type: 'error', message: response.data?.message || 'Failed to send message' });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto m-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Left section - Contact Form */}
      <div className="w-full lg:w-2/3 p-8 lg:p-12">
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2 tracking-wide">SEND US YOUR</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8">VALUABLE MESSAGE</h2>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`mb-4 px-4 py-3 rounded flex items-center ${
              status.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            <span className="ml-2">{status.message}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email id"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              name="place"
              placeholder="Place"
              value={formData.place}
              onChange={handleChange}
              className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <textarea
            name="message"
            placeholder="Message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'SEND'}
            </button>
          </div>
        </div>
      </div>

      {/* Right section - Contact Information */}
      <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-600 to-blue-700 p-8 lg:p-12 text-white">
        <div className="mb-8">
          <div className="text-sm text-blue-100 mb-2 tracking-wide">CONNECT US</div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-8">FOLLOWING ADDRESS</h3>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1 text-blue-200" />
            <div>
              <div className="font-semibold text-lg mb-1">Talent Education</div>
              <div className="text-blue-100 leading-relaxed">
                Police Station Road,<br />
                Sulthan Bathery School jn.<br />
                Meenangadi.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 mt-1 text-blue-200" />
            <div className="text-blue-100">
              <div>04936220095</div>
              <div>+91 8075 472 992</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-200" />
            <div className="text-blue-100">talentsmeenangadi@gmail.com</div>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-200" />
            <div className="text-blue-100">www.talentneet.com</div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ConnectUs;