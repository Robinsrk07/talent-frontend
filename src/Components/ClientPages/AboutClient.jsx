import axios from "axios";
import { useState, useEffect } from "react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AboutClient = () => {
  const [data, setData] = useState({});

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/about`);
      setData(res.data || {});
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // Safely split heading
  const heading = data.heading || "";
  const words = heading.split(" ");
  const firstTwoWords = words.slice(0, 2).join(" ");
  const restWords = words.slice(2).join(" ");

  return (
    <div className="flex flex-col h-auto bg-white gap-8 w-full">
      <div className="flex flex-col md:flex-row w-full m-2 min-h-[50vh]"> 
        <div className="w-full h-auto md:w-[40%] p-6">
          <div className="max-w-lg p-4 w-full text-left">
            <h1 className="text-blue-600 break-words">
              <span className="font-bold text-3xl md:text-5xl">{firstTwoWords} </span><br />
              <span className="font-bold text-5xl md:text-8xl">{restWords}</span>
            </h1>
          </div>
          <div className="w-full h-auto p-4">
            <p className="text-gray-800 leading-8 font-sans text-base text-justify">
              {data.description || "No description available."}
            </p>
          </div>
        </div>

        <div className="flex flex-row w-full px-2 md:px-0 h-auto gap-2 md:w-[60%]">
          <div className="w-1/2 overflow-hidden">
            {data.image1 ? (
              <img 
                src={`${VITE_API_BASE_URL}/uploads/${data.image1}`} 
                alt="About Image 1" 
                className="w-full h-[73%] object-cover"
              />
            ) : (
              <div className="w-full h-[73%] bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
            )}
          </div>

          <div className="w-1/2 gap-2 flex flex-col">
            <div className="w-full h-[40%] bg-[#325afe] text-semibold text-xl text-white flex justify-center items-center p-2">
              <p>{data.quote ? `'${data.quote}'` : "No quote available"}</p>
            </div>
            <div className="w-full h-[40%] overflow-hidden">
              {data.image2 ? (
                <img 
                  src={`${VITE_API_BASE_URL}/uploads/${data.image2}`} 
                  alt="About Image 2" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full p-8 min-h-[50vh]">
        {/* Vision Section */}
        <div className="w-full h-auto bg-[#325afe] text-white md:w-1/2 px-8 min-h-[45vh]">
          <div className="max-w-lg p-4 w-full text-left">
            <h1 className="font-extrabold text-6xl break-words text-white">
              {data.visionTitle || "Our Vision"}
            </h1>
          </div>
          <div className="w-full h-auto text-white p-4">
            <p className="leading-8 font-sans text-base text-justify">
              {data.visionDescription || "No vision description provided."}
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="w-full h-auto md:w-1/2 min-h-[45vh] mt-4 bg-gray-300 p-8 text-black">
          <div className="max-w-lg p-4 w-full text-left">
            <h1 className="font-extrabold text-5xl md:text-6xl break-words text-black">
              {data.missionTitle || "Our Mission"}
            </h1>
          </div>
          <div className="w-full h-auto text-black p-4">
            <p className="leading-8 font-sans text-base text-justify">
              {data.missionDescription || "No mission description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutClient;
