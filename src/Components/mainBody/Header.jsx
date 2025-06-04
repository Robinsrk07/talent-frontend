import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import Logo from '../../assets/talent (2)/logo-white.png';
import Logo1 from '../../assets/talent (2)/Logo-dark.png';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const location = useLocation();
  const [aboutPageData, setAboutPageData] = useState(null);
  const [focusPageData, setFocusPageData] = useState(null);
  const [scrollData, setScrollData] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fade, setFade] = useState(true);
  const [banners, setBanners] = useState([]);
  const [backGround, setbackGround] = useState([]);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    percentage: '',
    school: '',
    board: 'CBSE',
    gender: 'Male',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/about`);
      setAboutPageData(res.data);
    } catch (err) {
      console.error('Error fetching about page:', err);
    }
  };

  const fetchBackgroundImage = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/about`);
      setbackGround(res.data);
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
  };

  const fetchScroll = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/scroll`);
      setScrollData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error('Error fetching scroll data:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchBackgroundImage();
  }, []);

  useEffect(() => {
    fetchScroll();
    fetchBanners();
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
    const pathname = location.pathname;

    if (pathname === '/about' && aboutPageData?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${aboutPageData.topBanner})`;
    }

    if (pathname === '/focus' && focusPageData?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${focusPageData.topBanner})`;
    }

    if (backGround?.topBanner) {
      return `url(${VITE_API_BASE_URL}/uploads/${backGround.topBanner})`;
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
    item.status === 'active' || item.active
  );

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const percentageRegex = /^[0-9]{1,3}(\.[0-9]{1,2})?$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.percentage.trim()) {
      newErrors.percentage = 'Percentage is required';
    } else if (!percentageRegex.test(formData.percentage) || parseFloat(formData.percentage) > 100) {
      newErrors.percentage = 'Please enter a valid percentage (0-100)';
    }
    if (!formData.school.trim()) newErrors.school = 'School name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/register/register`, formData);
      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          percentage: '',
          school: '',
          board: 'CBSE',
          gender: 'Male',
          address: ''
        });
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowRegisterModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      percentage: '',
      school: '',
      board: 'CBSE',
      gender: 'Male',
      address: ''
    });
    setErrors({});
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const handleModalClose = () => {
    setShowRegisterModal(false);
    resetForm();
  };

  if (location.pathname === '/') {
    return (
      <>
        <header className="relative w-full h-[150px] bg-[#325afe] text-white ">
          {/* Scroll bar section */}
          <div className="w-full h-[50px] bg-white text-black flex items-center overflow-hidden">
            <div className="absolute left:8 md:left-12 top-5 md:top-0 z-10 bg-red-500 text-xs  md:text-xl text-white h-[30px] w-[100px] md:h-[60px] md:w-[200px] flex items-center justify-center">
              <button onClick={() => setShowRegisterModal(true)}>
                Register Now
              </button>
            </div>

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
                
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="absolute top-14 left-4 md:left-14 w-[150px] md:w-[200px] z-10">
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

          {showNavbar && (
            <nav className="md:fixed top-0 left-0 h-[120px] w-full bg-white shadow-lg z-50 p-4 transition-all">
              <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold text-blue-600">
                  <img src={Logo1} alt="" style={{ width: '50px', height: '50px' }} />
                </div>
                <div className="space-x-4">
                  <Link to='/' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Home</Link>
                  <Link to='/about' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>About</Link>
                  <Link to='/focus' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Our Focus</Link>
                  <Link to='/courses' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Our Courses</Link>
                  <Link to='/services' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Services</Link>
                  <Link to='/gallery' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Gallery</Link>
                  <Link to='/result' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Result</Link>
                  <Link to='/contact' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Contact Us</Link>
                  <Link to='/online-class' className='text-gray-700 font-bold hover:font-semibold hover:text-blue-600'>Online Class</Link>
                </div>
              </div>
            </nav>
          )}

          {showRegisterModal && (
            <div className="fixed inset-0 z-50 text-gray-500 rounded-lg flex items-center justify-center bg-black/50 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-[80%] h-[80%] max-w-3xl relative overflow-y-auto">
                <button 
                  className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-black"
                  onClick={handleModalClose}
                >
                  ×
                </button>
                <h2 className="text-center text-lg font-semibold mb-6">
                  Talent Scholarship Examination For CBSE / State 10th Students Registration form
                </h2>
                
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="text-green-500 text-2xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold text-green-600">Registration Successful!</h3>
                    <p className="mt-2">Thank you for registering. We'll contact you soon.</p>
                  </div>
                ) : (
                  <>
                    {submitError && (
                      <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">
                        {submitError}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label>NAME *</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-2 ${errors.name ? 'border-red-500' : ''}`}
                          type="text"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label>E-MAIL *</label>
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-2 ${errors.email ? 'border-red-500' : ''}`}
                          type="email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label>MOBILE NUMBER *</label>
                        <input
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-2 ${errors.mobile ? 'border-red-500' : ''}`}
                          type="tel"
                        />
                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                      </div>
                      <div>
                        <label>PERCENTAGE *</label>
                        <input
                          name="percentage"
                          value={formData.percentage}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-2 ${errors.percentage ? 'border-red-500' : ''}`}
                          type="text"
                        />
                        {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage}</p>}
                      </div>
                      <div>
                        <label>SCHOOL *</label>
                        <input
                          name="school"
                          value={formData.school}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-2 ${errors.school ? 'border-red-500' : ''}`}
                          type="text"
                        />
                        {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
                      </div>
                      <div>
                        <label>BOARD OF EDUCATION *</label>
                        <select
                          name="board"
                          value={formData.board}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border p-2"
                        >
                          <option>CBSE</option>
                          <option>STATE</option>
                          <option>ICSE</option>
                        </select>
                      </div>
                      <div>
                        <label>SELECT YOUR GENDER *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border p-2"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label>ADDRESS *</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-2 ${errors.address ? 'border-red-500' : ''}`}
                          rows="3"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>
                      <div className="md:col-span-2 text-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-400"
                        >
                          {isSubmitting ? 'Submitting...' : 'SEND'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

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

          {/* Desktop Nav - FIXED RESPONSIVE POSITIONING */}
          <div className="hidden md:flex absolute top-16 md:top-20 lg:top-16 xl:top-20 right-4 md:right-8 lg:right-16 xl:right-20">
            <ul className="flex flex-wrap justify-end gap-1 md:gap-2 lg:gap-4 xl:gap-6 text-[8px] md:text-[10px] lg:text-[13px] xl:text-[15px] font-semibold uppercase font-sans tracking-wide max-w-[70%] md:max-w-[80%] lg:max-w-none">
              {navItems.map((item) => (
                <li key={item.path} className="whitespace-nowrap">
                  <Link
                    to={item.path}
                    className={`hover:text-pink-300 transition-colors ${
                      location.pathname === item.path
                        ? 'underline underline-offset-4 decoration-2'
                        : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </header>
      </>
    );
  }

  return (
    <header
      className={`w-full h-[30vh] md:h-[50vh] bg-no-repeat bg-cover bg-center relative text-white flex justify-center items-center transition-opacity duration-500 ${
        fade ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 255, 1), rgba(0, 0, 255, 0)), ${getBackgroundImage()}`
      }}
    >
      {/* Logo */}
      <div className="absolute top-4 md:top-6 left-4 md:left-14 w-[150px] md:w-[200px] lg:w-[250px] h-auto z-10">
        <img
          src={Logo}
          alt="Logo"
          className="w-full h-auto object-contain"
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundSize: 'contain',
          }}
        />
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

      {showNavbar && (
        <nav className="md:fixed top-0 left-0 h-[80px] w-full bg-white shadow-lg z-50 p-4 transition-all">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold text-blue-600">
              <img src={Logo1} alt="" style={{ width: '50px', height: '50px' }} />
            </div>
            <div className="space-x-4">
              <Link to='/' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Home</Link>
              <Link to='/about' className='text-gray-700 hover:font-semibold hover:text-blue-600'>About</Link>
              <Link to='/focus' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Our Focus</Link>
              <Link to='/courses' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Our Courses</Link>
              <Link to='/services' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Services</Link>
              <Link to='/gallery' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Gallery</Link>
              <Link to='/result' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Result</Link>
              <Link to='/contact' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Contact Us</Link>
              <Link to='/online-class' className='text-gray-700 hover:font-semibold hover:text-blue-600'>Online Class</Link>
            </div>
          </div>
        </nav>
      )}

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 w-full bg-black bg-opacity-40 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Desktop Nav - FIXED RESPONSIVE POSITIONING FOR OTHER PAGES */}
      <div className="hidden md:flex absolute top-12 md:top-16 lg:top-20 xl:top-24 right-4 md:right-8 lg:right-12 xl:right-20">
        <ul className="flex flex-wrap justify-end gap-1 md:gap-2 lg:gap-4 xl:gap-6 text-[8px] md:text-[10px] lg:text-[13px] xl:text-[16px] font-semibold uppercase font-sans tracking-wide max-w-[75%] md:max-w-[85%] lg:max-w-none">
          {navItems.map((item) => (
            <li key={item.path} className="whitespace-nowrap">
              <Link
                to={item.path}
                className={`hover:text-pink-300 transition-colors ${
                  location.pathname === item.path 
                    ? 'underline underline-offset-4 decoration-2' 
                    : ''
                }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl md:text-6xl font-bold drop-shadow-lg px-4 py-4 text-center">
        {navItems.find((item) => item.path === location.pathname)?.name || ''}
      </h1>
    </header>
  );
};

export default Header;