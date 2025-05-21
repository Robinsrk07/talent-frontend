import { HomeIcon, UserIcon, BriefcaseIcon, CogIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import Logo from "../../assets/Logo-dark.png";
import Logo1 from "../../assets/logo-white.png";
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom'; // Updated import for react-router-dom

const Dashboard = () => {
  const [openSections, setOpenSections] = useState({
    home: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar: Fixed, takes 20% of viewport width */}
      <div className="bg-[#AE89FF] w-full md:w-[20vw] h-screen fixed top-0 left-0 overflow-y-auto rounded-lg border border-gray-200">
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
              <li style={{ paddingLeft: '70px', paddingTop: '13px' }}>
                <Link to="/admin/dashboard/scroll" className="hover:text-black">
                  Scroll
                </Link>
              </li>
              <li style={{ paddingLeft: '70px', paddingTop: '5px' }}>
                <Link to="/admin/dashboard/banner" className="hover:text-black">
                  Banner
                </Link>
              </li>
              <li style={{ paddingLeft: '70px', paddingTop: '5px' }}>
                <Link to="/admin/dashboard/faculties-main" className="hover:text-black">
                  Faculties-main
                </Link>
              </li>
              <li style={{ paddingLeft: '70px', paddingTop: '5px' }}>
                <Link to="/admin/dashboard/teachers" className="hover:text-black">
                  Teachers
                </Link>
              </li>
              <li style={{ paddingLeft: '70px', paddingTop: '5px' }}>
                <Link to="/admin/dashboard/teams" className="hover:text-black">
                  Teams
                </Link>
              </li>
            </ul>
          )}

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
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
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
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
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
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
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
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
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
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            <Link to="/admin/dashboard/gallery">
              <span className="text-white font-bold">Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content: Offset by sidebar width and scrollable */}
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