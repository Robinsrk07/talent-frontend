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
    <div className="flex flex-col h-auto bg-white w-full">
      <div className="flex flex-col border border-gary-200 md:flex-row w-full m-2 min-h-[50vh]"> 
       <div className="w-full h-auto md:w-1/2 border border-gray-200  m-2">
       
         <h1>{data.heading}</h1>
         <p>{data.description}</p></div>
       <div className=" flex flex-row w-full h-auto md:w-1/2 border border-gray-200  m-2">
               <div className="border w-1/2 border-gray-200 m-2 " >
                           <img src={`${VITE_API_BASE_URL}/uploads/${data.image1}`} alt="About Image 1" />
               </div>
               <div className="border w-1/2 border-gray-200 m-2 " >
                 <div className="w-full h-1/2 border border-gray-200"><p>{data.quote}</p></div>
                 <div  className="w-full h-1/2 border border-gray-200">
                  <img src={`${VITE_API_BASE_URL}/uploads/${data.image2}`} alt="About Image 1" />
                 </div>
               </div>
       
       </div>

      </div>
      <div className="flex flex-col border border-gary-200  md:flex-row w-full m-2 min-h-[50vh]">
       <div className="w-full h-auto md:w-1/2 border border-gray-200 min-h-45vh m-2">
       <h1>{data.visionTitle}</h1>
       <p>{data.visionDescription}</p>
       
       </div>
       <div className="w-full h-auto md:w-1/2 border border-gray-200 min-h-45vh m-2">
       <h1>{data.missionTitle}</h1>
       <p>{data.missionDescription}</p>

       </div>


      </div>

    </div>
  );
};

export default AboutClient;
