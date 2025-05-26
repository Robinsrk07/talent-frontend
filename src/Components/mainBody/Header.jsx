import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Logo from "../../assets/talent (2)/logo-white.png"; // Adjust the path as necessary

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const location = useLocation();
  const [aboutPageData, setAboutPageData] = useState(null);
  const [focusPageData, setFocusPageData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fade, setFade] = useState(true); // for transition effect

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/about`);
      setAboutPageData(res.data);
    } catch (err) {
      console.error('Error fetching about page:', err);
    }
  };

  const fetchFocus = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/focus-meta`, {
        withCredentials: true,
      });
      setFocusPageData(res.data);
    } catch (err) {
      console.error('Error fetching focus page:', err);
    }
  };

  useEffect(() => {
    setFade(false); // Start fade-out
    const timeout = setTimeout(() => {
      if (location.pathname === '/about') {
        fetchAbout();
      } else if (location.pathname === '/focus') {
        fetchFocus();
      }
      setFade(true); // Fade-in after data loads
    }, 200);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const getBackgroundImage = () => {
    if (location.pathname === '/about' && aboutPageData?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${aboutPageData.topBanner})`;
    } else if (location.pathname === '/focus' && focusPageData?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${focusPageData.topBanner})`;
    } else if (focusPageData?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${focusPageData.topBanner})`;
    } else if (aboutPageData?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${aboutPageData.topBanner})`;
    }
    return 'none';
  };

  const navItems = [
    { title: 'HOME', name: 'HOME', path: '/' },
    { title: 'ABOUT-US', name: 'About Talent-Education', path: '/about' },
    { title: 'OUR FOCUS', name: 'Our Focus', path: '/focus' },
    { title: 'OUR COURSES', name: 'Our Courses', path: '/courses' },
    { title: 'SERVICES', name: 'Service & Features', path: '/services' },
    { title: 'GALLERY', name: 'Gallery', path: '/gallery' },
    { title: 'RESULT', name: 'A/A+ Winners', path: '/result' },
    { title: 'CONTACT US', name: 'Connect Us', path: '/contact' },
    { title: 'ONLINE CLASS', name: 'Student Login', path: '/online-class' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
   <div
  className={`w-full h-[50vh] bg-no-repeat bg-cover bg-center relative flex flex-col justify-center items-center text-white text-center px-4 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
  style={{
    backgroundImage: `linear-gradient(to top, rgb(52, 52, 219), rgba(0, 0, 255, 0)), ${getBackgroundImage()}`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
  }}
>
  {/* Logo at top-left */}
  <div className="absolute top-4 left-14 w-[200px] h-auto">
    <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
  </div>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
        </div>
      </button>

      {/* Mobile Slide Menu */}
      <div className={`md:hidden fixed top-0 left-0 w-80 h-full bg-black bg-opacity-95 backdrop-blur-sm z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col pt-16 px-6">
          <h2 className="text-xl font-bold text-white mb-8 border-b border-gray-600 pb-4">Navigation</h2>
          <ul className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`block py-3 px-4 rounded-lg text-base font-semibold uppercase transition-all hover:bg-white hover:bg-opacity-10 ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-20 text-pink-300'
                      : 'text-white hover:text-pink-300'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 w-1/2 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Desktop Navigation */}
      <div className="w-full h-full flex justify-end relative gap-6 lg:absolute lg:top-10 lg:right-10 transition-all duration-300">
        <ul className="hidden md:flex gap-6 text-md font-semibold uppercase rounded-lg px-6 py-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`${
                  location.pathname === item.path ? 'underline underline-offset-4' : ''
                } hover:text-pink-300 transition`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Page Title with fade transition */}
      <h1
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        {navItems.find((item) => item.path === location.pathname)?.name || ''}
      </h1>
    </div>
  );
};

export default Header;
