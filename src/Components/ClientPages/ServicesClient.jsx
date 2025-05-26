import React, { useEffect, useState } from "react";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServicesClient = () => {
  const [services, setServices] = useState([]);
  const [features, setFeatures] = useState([]);
  const [ourPrograms, setOurPrograms] = useState([]);
  console.log( 'programms',ourPrograms);
  
  // Fetch services from backend
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/services`);
      if (res.status === 200) {
        setServices(res.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch features from backend
  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/features`);
      if (res.status === 200) {
        setFeatures(res.data);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchOurPrograms =async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/courses`);

      if (res.status === 200) {
        setOurPrograms(res.data);
      }
    } catch (error) {
      console.error("Error fetching our programs:", error);
    }
  }

  useEffect(() => {
    fetchServices();
    fetchFeatures();
    fetchOurPrograms();
  }, []);

  return (
    <div className="w-full bg-gray-100 py-12 px-4">
      {/* Services Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={`${VITE_API_BASE_URL}/uploads/${service.image}`}
                alt={service.heading}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold uppercase mb-3">
                  {service.heading}
                </h2>
                <p className="text-gray-700">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 px-4 rounded-lg shadow-md max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Our Features
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-start space-x-4">
              <div className="mt-1 text-blue-600 text-lg">●</div>
              <p className="text-gray-700">{feature.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesClient;
