import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import Logo from '../../assets/talent (2)/logo-white.png';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const location = useLocation();
  const [aboutPageData, setAboutPageData] = useState(null);
  const [focusPageData, setFocusPageData] = useState(null);
  const [scrollData, setScrollData] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fade, setFade] = useState(true);
  const [banners, setBanners] = useState([]);
  console.log(banners);
  
console.log(banners);

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
      const res = await axios.get(`${VITE_API_BASE_URL}/focus-meta`);
      setFocusPageData(res.data);
    } catch (err) {
      console.error('Error fetching focus page:', err);
    }
  };
 const fetchBanners = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/allbanners`);
      setBanners(res.data);
    } catch (err) {
      console.error('Error fetching banners:', err);
    }
 }
  const fetchScroll = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/scroll`);
      setScrollData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error('Error fetching scroll data:', err);
    }
  };

  useEffect(() => {
    fetchScroll();
    fetchBanners()
  }, []);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => {
      if (location.pathname === '/about') {
        fetchAbout();
      } else if (location.pathname === '/focus') {
        fetchFocus();
      }
      setFade(true);
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleNavClick = () => setIsMobileMenuOpen(false);

 const activeScrollItems = scrollData.filter(item => 
    item.status === 'active' || item.active // handles both possibilities
  );
  // Custom home header
  if (location.pathname === '/') {
    return (
      <>
      <header className="relative w-full h-[25vh] bg-[#325afe] text-white">
        {/* Scroll bar section */}
        <div className="w-full h-[50px] bg-white text-black flex items-center overflow-hidden">
          {activeScrollItems.length > 0 ? (
            <Marquee 
              speed={50} 
              gradient={false} 
              pauseOnHover
              className="py-3"
            >
              {activeScrollItems.map((item, index) => (
                <div key={index} className="flex items-center mx-8">
                  <span className="text-lg font-medium">{item.content}</span>
                  {index < activeScrollItems.length - 1 && (
                    <span className="mx-8 text-2xl">•</span>
                  )}
                </div>
              ))}
            </Marquee>
          ) : (
            <div className="w-full text-center text-lg font-medium">
              No active announcements
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="absolute top-12 left-14 w-[200px]">
          <img src={Logo} alt="Logo" className="object-contain w-full h-auto" />
        </div>

        {/* Mobile Menu */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-black bg-opacity-50 rounded hover:bg-opacity-70"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-white transform transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-5 h-0.5 bg-white transform transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
          </div>
        </button>

        {/* Slide Menu (Mobile) */}
        <nav className={`md:hidden fixed top-0 left-0 w-80 h-full bg-white z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="pt-16 px-6">
            <h2 className="text-xl font-bold border-b pb-4 mb-8">Navigation</h2>
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleNavClick}
                    className={`block py-3 px-4 rounded-lg text-base font-semibold uppercase transition-all ${
                      location.pathname === item.path
                        ? 'bg-black bg-opacity-10 text-blue-700'
                        : 'hover:bg-gray-200 text-black'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 w-full bg-black bg-opacity-40 z-30"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Desktop Nav */}
        <ul className="hidden md:flex absolute top-20 right-10 gap-6 text-sm font-semibold uppercase">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`hover:text-pink-300 ${location.pathname === item.path ? 'underline underline-offset-4' : ''}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul> 
      </header>
             <div className="border border-gray-800 w-full h-[300px] flex flex-row">
  {/* Sidebar - hidden on small screens, visible on md+ */}
  <div className="hidden md:block w-[20%] border border-gray-400 p-4">
    {/* Sidebar content goes here */}
  </div>

  {/* Main Content - Image Carousel */}
  <div className="w-full md:w-[80%] border border-gray-400 p-4">
    {banners.length > 0 ? (
      <div className="relative h-full w-full overflow-hidden">
        <div className="flex h-full gap-4 animate-scroll whitespace-nowrap">
          {banners
            .map((item) => (
              console.log(item),
              
             <div 
  key={item.id} 
  className="inline-flex flex-col items-center justify-center h-full min-w-[calc(100%-1rem)] md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1rem)] px-2"
>
  {/* Title on top */}
  <div className="h-[20%] flex items-center justify-center">
    <h3 className="text-lg font-semibold text-white text-center">{item.title}</h3>
  </div>

  {/* Image below */}
  <div className="relative h-[80%] w-full">
    <img 
      src={`${VITE_API_BASE_URL}/uploads/${item.filename}`} 
      alt={item.title}
      className="h-full w-full object-contain"
    />
  </div>
</div>

            ))}
        </div>
      </div>
    ) : (
      <div className="h-full flex items-center justify-center">
        <p>No active banners to display</p>
      </div>
    )}
  </div>
</div>

{/* Add this to your CSS or as a style tag */}
<style>{`
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  .animate-scroll {
    animation: scroll 20s linear infinite;
    display: inline-flex;
  }
  .animate-scroll:hover {
    animation-play-state: paused;
  }
`}</style>


      </>
    );
  }

  // Header for all other pages
  return (
    <header
      className={`w-full h-[50vh] bg-no-repeat bg-cover bg-center relative text-white flex justify-center items-center transition-opacity duration-500 ${
        fade ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(52,52,219,0.8), rgba(0,0,255,0.3)), ${getBackgroundImage()}`,
      }}
    >
      {/* Logo */}
      <div className="absolute top-4 left-14 w-[200px] h-auto">
        <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Mobile Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-black bg-opacity-50 rounded"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-white transform transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
          <span className={`block w-5 h-0.5 bg-white ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block w-5 h-0.5 bg-white transform transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
        </div>
      </button>

      {/* Slide Menu */}
      <nav className={`md:hidden fixed top-0 left-0 w-80 h-full bg-black bg-opacity-95 z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pt-16 px-6 text-white">
          <h2 className="text-xl font-bold mb-8 border-b border-gray-600 pb-4">Navigation</h2>
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`block py-3 px-4 rounded-lg uppercase transition-all ${
                    location.pathname === item.path ? 'bg-white bg-opacity-20 text-pink-300' : 'hover:text-pink-300'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 w-full bg-black bg-opacity-40 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop Nav */}
      <ul className="hidden md:flex absolute top-10 right-10 gap-6 text-md font-semibold uppercase">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`hover:text-pink-300 ${location.pathname === item.path ? 'underline underline-offset-4' : ''}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Page Title */}
      <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg px-4 text-center">
        {navItems.find((item) => item.path === location.pathname)?.name || ''}
      </h1>
    </header>
  );
};

export default Header;