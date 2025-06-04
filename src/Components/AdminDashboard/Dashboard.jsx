import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo1 from "../../assets/logo-white.png";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Dashboard = () => {
  const [openSections, setOpenSections] = useState({
    home: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on component mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

 const handleLogout = async () => {
  try {
    const res = await axios.post(
      `${VITE_API_BASE_URL}/logout`, // Make sure path matches your backend route
      {}, // Empty data object
      {
        withCredentials: true // THIS IS CRUCIAL FOR COOKIE OPERATIONS
      }
    );

    if (res.status === 200) {
      // Clear client-side storage
      localStorage.clear();
      
      // Force full page reload to clear all application states
      window.location.replace('/admin/login');

    }
  } catch (err) {
    console.error('Logout failed:', err);
    // Optional: Show error to user
    alert('Logout failed. Please try again.');
  }
};


  return (
    <div className="flex min-h-screen">
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#AE89FF] p-2 rounded-md text-white"
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-[#AE89FF] w-[80vw] md:w-[20vw] h-screen fixed top-0 left-0 overflow-y-auto rounded-lg border border-gray-200 transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="w-full h-[20vh] p-8 flex items-center space-x-4">
          <img className="w-50 h-25" src={Logo1} alt="Talent Logo" />
        </div>
        <hr className="border-t border-gray-300 mb-4 mx-8" />
        <div className="text-sm text-gray-400 flex flex-col justify-center">
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
            onClick={() => toggleSection('home')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            <span className="text-white font-bold">Home</span>
            <span
              className="text-xs text-white"
              style={{ paddingLeft: '60px', fontSize: '7px', width: '9px' }}
            >
              {openSections.home ? '▲' : '▼'}
            </span>
          </div>

          {openSections.home && (
            <ul className="text-white">
              <li 
                style={{ paddingLeft: '70px', paddingTop: '13px' }}
                onClick={closeSidebar}
              >
                <Link to="/admin/dashboard/scroll" className="hover:text-black">
                  Scroll
                </Link>
              </li>
              <li 
                style={{ paddingLeft: '70px', paddingTop: '5px' }}
                onClick={closeSidebar}
              >
                <Link to="/admin/dashboard/banner" className="hover:text-black">
                  Banner
                </Link>
              </li>
              <li 
                style={{ paddingLeft: '70px', paddingTop: '5px' }}
                onClick={closeSidebar}
              >
                <Link to="/admin/dashboard/faculties-main" className="hover:text-black">
                  Faculties-main
                </Link>
              </li>
              <li 
                style={{ paddingLeft: '70px', paddingTop: '5px' }}
                onClick={closeSidebar}
              >
                <Link to="/admin/dashboard/teachers" className="hover:text-black">
                  Teachers
                </Link>
              </li>
              <li 
                style={{ paddingLeft: '70px', paddingTop: '5px' }}
                onClick={closeSidebar}
              >
                <Link to="/admin/dashboard/teams" className="hover:text-black">
                  Teams
                </Link>
              </li>
            </ul>
          )}

          {/* Other menu items with closeSidebar on click */}
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
            onClick={closeSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="white"
              className="size-4">
  <path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clip-rule="evenodd" />
</svg>

            <Link to="/admin/dashboard/aboutus">
              <span className="text-white font-bold">About Us</span>
            </Link>
          </div>

         <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >
  <path fill-rule="evenodd" d="M17.303 5.197A7.5 7.5 0 0 0 6.697 15.803a.75.75 0 0 1-1.061 1.061A9 9 0 1 1 21 10.5a.75.75 0 0 1-1.5 0c0-1.92-.732-3.839-2.197-5.303Zm-2.121 2.121a4.5 4.5 0 0 0-6.364 6.364.75.75 0 1 1-1.06 1.06A6 6 0 1 1 18 10.5a.75.75 0 0 1-1.5 0c0-1.153-.44-2.303-1.318-3.182Zm-3.634 1.314a.75.75 0 0 1 .82.311l5.228 7.917a.75.75 0 0 1-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 0 1-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 0 1-1.247-.606l.569-9.47a.75.75 0 0 1 .554-.68Z" clip-rule="evenodd" />
</svg>





            <Link to="/admin/dashboard/ourfocus">
              <span className="text-white font-bold">Our Focus</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >
  <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
  <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
  <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
</svg>




            <Link to="/admin/dashboard/ourcourses">
              <span className="text-white font-bold">Our Courses</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
            
<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >  <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
  <path fillRule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clipRule="evenodd" />
</svg>


            <Link to="/admin/dashboard/services">
              <span className="text-white font-bold">Services</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >
  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
</svg>

            <Link to="/admin/dashboard/gallery">
              <span className="text-white font-bold">Gallery</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
            

 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
</svg>



            <Link to="/admin/dashboard/results">
              <span className="text-white font-bold">Results</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>


            <Link to="/admin/dashboard/students">
              <span className="text-white font-bold">Students</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>


            <Link to="/admin/dashboard/register">
              <span className="text-white font-bold">New Registretions</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>


            <Link to="/admin/dashboard/popup">
              <span className="text-white font-bold">PopUp</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
          >
           

 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>


            <Link to="/admin/dashboard/changepassword">
              <span className="text-white font-bold">ChangePassword</span>
            </Link>
          </div>
          <div
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700"
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
            onClick={handleLogout}
          >
            

 <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-4"
            >  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

            
              <span className="text-white font-bold">LogOut</span>
            
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:ml-[20vw] md:w-[80vw] min-h-screen bg-white">
        <div className="w-full h-[12vh] border border-gray-200 m-2 rounded-lg shadow-md">
          {/* Header content */}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;