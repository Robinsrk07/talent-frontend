import React, { useEffect, useState } from "react";
import axios from "axios";

const Focus = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [focusData, setFocusData] = useState([]);

  const fetchFocus = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/focus-items`);
      if (res.status === 200) setFocusData(res.data || []);
    } catch (error) {
      console.error("Error fetching focus data:", error);
    }
  };

  useEffect(() => {
    fetchFocus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-2 py-2 md:px-20 py-20">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {focusData.map((item) => {
          const { id, image, heading, subHeading, description } = item || {};

          return (
            <div
              key={id || Math.random()} // fallback key
              className="flex flex-col md:flex-row bg-white shadow-lg overflow-hidden"
            >
              {/* Image */}
              {image ? (
                <div className="w-full md:w-1/2 md:h-[60vh]">
                  <img
                    src={`${VITE_API_BASE_URL}/uploads/${image}`}
                    alt={heading || "Focus Item"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-1/2 md:h-[60vh] bg-gray-300 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}

              {/* Text */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-2">
                  {heading || "No Heading"}
                </h2>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {subHeading || "No Subheading"}
                </h3>
                <p className="text-gray-600 text-[10px]">
                  {description || "No description provided."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Focus;
