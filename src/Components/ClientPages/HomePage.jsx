import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import about from "../../assets/talent (2)/GALLERY/about.jpg"; // Adjust the path as necessary
import { Link } from "react-router";


const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [facultyMain, setFacultyMain] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [groupedTeachers, setGroupedTeachers] = useState({});
  const [teamsWithTeachers, setTeamsWithTeachers] = useState([]);
  const[popup,setPopUp] =useState([])
  const[isPopUp,setIsPopUp] = useState(true)

  
  

const [teams, setTeams] = useState([]);


  

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/allbanners`);
        const activeBanners = response.data.filter((banner) => banner.active);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    fetchBanners();
  }, []);

useEffect(() => {
  const fetchPopUp = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/popup`);
      setPopUp(res.data);
      if (res.data.length === 0) {
        setIsPopUp(false); // auto-close if no banners
      }
    } catch (error) {
      console.error("Error fetching popup:", error);
      setIsPopUp(false); // hide on error
    }
  };

  fetchPopUp();
}, []);


useEffect(() => {
  const fetchFacultyMain = async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/faculty-main`);

      const activeData = response.data.data.find(item => item.active); // only the active one
      setFacultyMain(activeData);
    } catch (error) {
      console.error("Error fetching faculty main:", error);
    }
  };
  fetchFacultyMain();
}, []);

 const groupTeachersBySubject = (teachers) => {
    return teachers.reduce((grouped, teacher) => {
      const subject = teacher.subject.toLowerCase();
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(teacher);
      return grouped;
    }, {});
  };


useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/teacher`);
   const activeTeachers = response.data.data.filter(teacher => teacher.active)
      setTeachers(activeTeachers); // only the active teachers
        setGroupedTeachers(groupTeachersBySubject(activeTeachers));

    } catch (error) {
      console.error("Error fetching faculty main:", error);
    }}
    fetchTeachers();
  },[])

  useEffect(() => {
  if (teams.length && Object.keys(groupedTeachers).length) {
    const mapped = teams.map(team => {
      // Extract last word of title as subject
      const words = team.title.trim().split(" ");
      const subject = words[words.length - 1].toLowerCase();

      // Get teachers for that subject
      const teachers = groupedTeachers[subject] || [];

      return { ...team, subject, teachers };
    });
    setTeamsWithTeachers(mapped);
  }
}, [teams, groupedTeachers]);

  useEffect(() => {
    const fetchTeams= async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/team`);

        setTeams(response.data.data); // only the active teams
      } catch (error) {
        console.error("Error fetching faculty main:", error);
      }
    };
    fetchTeams();
  } , []);
  return (
    <div className="flex flex-col w-full h-auto ">

      <div className="bg-[#325afe] w-full flex flex-row">
        {/* Left Sidebar - visible only on lg+ screens */}
        <div className="hidden lg:flex lg:w-[13vw] h-auto flex-col gap-12 items-center justify-end text-white">
          <span className="transform -rotate-90 whitespace-nowrap text-[18px] font-semibold mb-4">
            Follow us through
          </span>
          <div className="w-px h-40 bg-white"></div>
          <h2 className="font-semibold text-xl">f</h2>
                  </div>

        {/* Right Banner Section */}
        <div className="w-full lg:w-[87vw] h-[300px] lg:h-[550px] px-2 lg:px-0 lg:mx-8">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            slidesPerView={1.3} // Shows current slide + 30% of next
            spaceBetween={20}   // Gap between slides
            centeredSlides={true} // Centers the active slide
            className="w-full h-full"
            breakpoints={{
              // Mobile
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              // Tablet
              768: {
                slidesPerView: 1.1,
                spaceBetween: 10,
              },
              // Desktop
              1024: {
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
            }}
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative w-full h-full flex justify-center items-center">
                  <img
                    src={`${VITE_API_BASE_URL}/uploads/${banner.filename}`}
                    alt={banner.title}
                    className="rounded-lg w-full h-full object-cover"
                  />

                  {/* Title at Bottom */}
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-center px-4 pb-6">
                    <h2 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold text-center drop-shadow-lg">
                      {banner.title}
                    </h2>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-200">
        {/* Text Section - 40% width */}
       <div className="w-full lg:w-[40%] flex flex-col items-end px-6 lg:px-12 py-10 text-right">
        <h1 className="text-5xl md:text-6xl lg:text-[150px] lg:px-2 font-bold text-gray-800">talent</h1>
        <h2 className="text-2xl md:text-3xl lg:text-5xl text-gray-800 mt-2">Revolution in neet</h2>
        <p className="text-gray-700 m-2 mt-6 max-w-md text-sm md:text-base leading-relaxed">
          TALENT Institute of Educational Excellence IS established by entrance frame professionals.
          Which had emerged after a long interaction of top class academicians with engineering and
          medical aspirant of the state. In the emerging scenario TALENT is providing high quality ...
        </p>
        <Link to='/about'>
        <button className="w-[50vw] h-[40px] lg:w-[200px] lg:h-[50px] text-white rounded-lg bg-blue-600 mt-4">
          Continue Reading..
        </button></Link>
      </div>


        {/* Image Section - 60% width */}
        <div className="w-full lg:w-[60%] flex items-center justify-center p-4 lg:m-8">
          <img className="w-full h-auto object-cover" src={about} alt="About Talent" />
        </div>
      </div>

   <div className="w-full relative flex flex-col gap-2 md:gap-0 lg:flex-row ">
  {/* First Div */}
  <div className="w-full lg:w-[60vw] relative  h-[90vh]">
  {facultyMain && (
    <>
      <img
        src={`${VITE_API_BASE_URL}/uploads/${facultyMain.filename}`}
        alt="Faculty"
        className="w-full h-full object-cover"
      />
     <div className="absolute inset-0 flex flex-col justify-center items-start px-12 text-white bg-black/40 ">
  <h1 className="font-bold leading-tight whitespace-pre-line">
    {(() => {
      const words = facultyMain.title.split(' ');
      const firstWord = words[0];
      const secondWord = words[1];
      const remainingWords = words.slice(2).join(' ');
      
      return (
        <>
          <span className="text-5xl md:text-6xl lg:text-[150px] block text-white">
            {firstWord}
          </span>
          <span className="text-3xl md:text-4xl lg:text-7xl font-semibold text-white">
            {secondWord}
            {remainingWords && (
              <>
                {remainingWords}
              </>
            )}
          </span>
        </>
      );
    })()}
  </h1>
  <p className="text-lg lg:text-xl mt-4">{facultyMain.subtitle}</p>
</div>

    </>
  )}
</div>


  {/* Second Div */}
  {/* Second Div */}
<div className="w-full lg:w-[50vw] h-[70vh]  bg-white shadow-lg 
                lg:absolute lg:right-5 lg:top-1/2 lg:transform lg:-translate-y-1/2 
                 ">

<Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            slidesPerView={1.3} // Shows current slide + 30% of next
            spaceBetween={20}   // Gap between slides
            centeredSlides={true} // Centers the active slide
            className="w-full h-full"
            breakpoints={{
              // Mobile
              320: {
                slidesPerView: 1.1,
                spaceBetween: 10,
              },
              // Tablet
              768: {
                slidesPerView: 1.1,
                spaceBetween: 10,
              },
              // Desktop
              1024: {
                slidesPerView: 2,
                spaceBetween: 5,
              },
            }}
          >
           {teachers.map((teacher) => (
            <SwiperSlide key={teacher.id}>
              <div className="relative w-[95%] h-full flex justify-center items-center">
                <img
                  src={`${VITE_API_BASE_URL}/uploads/${teacher.filename}`}
                  alt={teacher.name}
                  className="rounded-lg w-full h-full object-cover"
                />

                {/* Blue Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-700 to-transparent rounded-lg" />

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col items-start justify-end px-4 pb-6 text-left">
                  <h2 className="text-white text-xl lg:text-2xl font-semibold drop-shadow-md">
                    {teacher.name}
                  </h2>
                  <p className="text-white text-sm lg:text-base mt-1 drop-shadow-md">
                    {teacher.qualifications}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          </Swiper>

 
</div>

</div>

 <div className="w-full h-[80vh] relative bg-gray-100 px-4 lg:px-12 py-12">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="w-full h-full"
      >
        {teamsWithTeachers.map((team) => (
          <SwiperSlide key={team.id}>
            <div className="flex flex-col lg:flex-row shadow-md rounded-xl overflow-hidden h-full bg-white">
              {/* Image Div - Fixed height for mobile */}
              <div className="w-full lg:w-1/2 h-[200px] lg:h-full">
                <img
                  src={`${VITE_API_BASE_URL}/uploads/${team.filename}`}
                  alt={team.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content Div - Fixed scrolling issue */}
              <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col overflow-y-auto">
                <p className="text-gray-700 mt-2 text-base lg:text-lg leading-relaxed">
                  {team.description}
                </p>

                <div className="w-full mx-auto h-screen px-2 lg:px-4 py-4 lg:py-6">
                  <h3 className="text-xl md:text-3xl font-bold mb-3 text-gray-800 border-b-2 border-blue-200 pb-2">
                    Team Of {team.subject.charAt(0).toUpperCase() + team.subject.slice(1)} Teachers
                  </h3>
                  <ul className="space-y-2">
                    {team.teachers.map((teacher) => (
                      <li key={teacher.id} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                        <div className="min-w-0"> {/* Crucial for text overflow */}
                          <p className="font-medium text-base md:text-lg text-gray-800 break-words">
                            {teacher.name}
                          </p>
                          <p className="text-gray-600 text-xs md:text-sm break-words">
                            {teacher.qualifications}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

<div className="h-[300px]   bg-[#325afe] flex justify-center items-center p-4" >
 <h1 className="text-white text-[40px]  font-bold"> Get Started Now  .Its  Free Now</h1>
  
</div>
{isPopUp && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="relative bg-white p-4 w-[90%] md:w-1/2  rounded-lg shadow-xl overflow-hidden">
      {/* Close Button */}
      <button
        onClick={() => setIsPopUp(false)}
        className="absolute top-3 right-3 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center text-lg"
      >
        &times;
      </button>

      {/* Scrollable container */}
      <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory">
        {popup.map((item) => (
          <div
  key={item.id}
  className="flex-shrink-0 w-full h-[70vh] snap-center"
>
  <img
    src={`${VITE_API_BASE_URL}/uploads/${item.filename}`}
    alt="Popup Banner"
    className="w-full h-full object-cover"
  />
</div>

        ))}
      </div>
    </div>
  </div>
)}







    </div>
  );
};

export default HomePage;