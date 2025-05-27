import React, { useEffect, useState } from "react";
import axios from "axios";

const Focus = () => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [focusData, setFocusData] = useState([]);

  const fetchFocus = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/focus-items`);
      if (res.status === 200) setFocusData(res.data);
    } catch (error) {
      console.error("Error fetching focus data:", error);
    }
  };

  useEffect(() => {
    fetchFocus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Grid container for 2 cards per row on large screens */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {focusData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row bg-white  shadow-lg  overflow-hidden"
          >
            {/* Image (Top on mobile, Left on desktop) */}
            <div className="w-full md:w-1/2 h-48 md:h-[60vh]">
              <img
                src={`${VITE_API_BASE_URL}/uploads/${item.image}`}
                alt={item.heading}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text (Below on mobile, Right on desktop) */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
              <h2 className="text-5xl font-bold  mb-2">{item.heading}</h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">{item.subHeading}</h3>
              <p className="text-gray-600 text-[10px]">{item.description}</p>            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Focus;