import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AboutClient = () => {
    const [data, setData] = useState({})
  console.log(data);
  
  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/about`);
      // No need for res.ok, axios throws on error status
      const data = res.data;
      setData(data);
      console.log("About data:", data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  return (
    <div className="flex flex-col h-auto bg-white gap-8 w-full">
      <div className="flex flex-col  md:flex-row w-full m-2 min-h-[50vh]"> 
       <div className="w-full h-auto md:w-[40%]  p-4  ">
       
      <div className="max-w-lg p-4 w-full text-left">
        <h1 
          className="font-extrabold text-blue-600 text-6xl break-words"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
        >
          {data.heading}
        </h1>
      </div>
         <div className="w-full h-auto p-4">
          <p className="text-gray-500 leading-8 font-sans text-base text-justify">
            {data.description}
          </p>
        </div>
         
         
         
         </div>
      <div className="flex flex-row w-full h-auto gap-2 md:w-[60%] ">
        <div className=" w-1/2   overflow-hidden">
          <img 
            src={`${VITE_API_BASE_URL}/uploads/${data.image1}`} 
            alt="About Image 1" 
            className="w-full h-[73%] object-cover"
          />
        </div>
        <div className=" w-1/2  gap-2  flex flex-col">
          <div className="w-full h-[40%]  bg-[#325afe] text-semibold text-xl text-white flex justify-center items-center p-2">
            <p>{`'${data.quote}'`}</p>
          </div>
          <div className="w-full h-[40%]  overflow-hidden">
            <img 
              src={`${VITE_API_BASE_URL}/uploads/${data.image2}`} 
              alt="About Image 2" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      </div>
     <div className="flex flex-col  md:flex-row w-full p-8 min-h-[50vh]">
  {/* Vision Section */}
  <div className="w-full h-auto bg-[#325afe] text-white md:w-1/2  px-8  min-h-[45vh] ">
    <div className="max-w-lg p-4 w-full text-left">
      <h1
        className="font-extrabold text-6xl break-words text-white"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
      >
        {data.visionTitle}
      </h1>
    </div>
    <div className="w-full h-auto text-white p-4">
      <p className="leading-8 font-sans text-base text-justify">{data.visionDescription}</p>
    </div>
  </div>

  {/* Mission Section */}
  <div className="w-full h-auto md:w-1/2  min-h-[45vh] mt-4 bg-gray-300 p-8 text-black">
    <div className="max-w-lg p-4 w-full text-left">
      <h1
        className="font-extrabold text-6xl break-words text-black"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
      >
        {data.missionTitle}
      </h1>
    </div>
    <div className="w-full h-auto text-black p-4">
      <p className="leading-8 font-sans text-base text-justify" >{data.missionDescription}</p>
    </div>
  </div>
</div>


    </div>
  );
};

export default AboutClient;
