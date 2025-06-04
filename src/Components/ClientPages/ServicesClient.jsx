import React, { useEffect, useState } from "react";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ServicesClient = () => {
  const [services, setServices] = useState([]);
  const [features, setFeatures] = useState([]);
  const [ourPrograms, setOurPrograms] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/services`);
      if (res.status === 200) setServices(res.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/features`);
      if (res.status === 200) setFeatures(res.data || []);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchOurPrograms = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/courses`);
      if (res.status === 200) setOurPrograms(res.data || []);
    } catch (error) {
      console.error("Error fetching our programs:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchFeatures();
    fetchOurPrograms();
  }, []);

  return (
    <div className="w-full bg-gray-100">
      {/* Services Section */}
      <section className="mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4 py-4 md:px-20 md:py-20">
          {services.map((service) => {
            const { id, image, heading, description } = service || {};
            return (
              <div
                key={id || Math.random()}
                className="bg-white shadow-lg min-h-[500px] overflow-hidden"
              >
                {image ? (
                  <img
                    src={`${VITE_API_BASE_URL}/uploads/${image}`}
                    alt={heading || "Service"}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-300 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-6 text-center">
                  <h2 className="text-xl font-bold uppercase mb-3">
                    {heading || "No Heading"}
                  </h2>
                  <p className="text-gray-700">
                    {description || "No description available."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-200 shadow-md w-full">
        <h1 className="text-6xl font-bold text-center text-gray-800 m-10">
          OUR FEATURES
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 p-12">
          {features.map((feature) => (
            <div key={feature?.id || Math.random()} className="flex items-start space-x-4">
              <div className="mb-1 text-blue-600 text-lg">●</div>
              <p className="text-gray-700">{feature?.title || "No title"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="bg-gray-200 shadow-md w-full">
        <h1 className="text-6xl font-bold text-center text-gray-800 m-10">
          OUR PROGRAMS
        </h1>

        <div className="flex flex-col p-12 gap-8">
          {ourPrograms.map((program) => {
            const { id, heading, subheading, description } = program || {};
            return (
              <div key={id || Math.random()}>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {heading || "No heading"}
                </h1>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {subheading || "No subheading"}
                </h3>
                <p className="text-gray-700">
                  {description || "No description provided."}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ServicesClient;
