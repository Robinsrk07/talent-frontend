import { Link } from "react-router";

const Footer = () => {
  
  return (
    <div className="w-full bg-[#1d1d1d] text-white  ">
      {/* Navigation Links - hide on mobile */}
      <div className="hidden md:flex justify-center space-x-6 m-8 text-[13px] uppercase tracking-wider p-4">
      <Link to='/'>Home</Link>
      <Link to='/about'>About Us</Link>
      <Link to='/focus'>Our Focus</Link>
      <Link to='/courses'>Our Courses</Link>
      <Link to='/services'>Services</Link>
      <Link to='/gallery'>Gallery</Link>
      <Link to ='/contact'>Contact Us</Link>
      </div>

      {/* Address */}
      <div className="text-[13px] uppercase tracking-wider text-center leading-relaxed mb-4 p-4">
        <p>Police Station Road, Sulthan Bathery.</p>
        <p>SBI Building Leo Hospital Road</p>
        <p>Kalpetta, Laiqua Gold Building Mysore</p>
        <p>Road Mananthavady</p>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-center md:text-left gap-4 m-4">
        <h2>Connect us : +91 8111 846 168 , +91 8111 846 161</h2>
        <h2>Mail us : talentsmeenangadi@gmail.com</h2>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-600 mt-4 pt-4 w-full bg-white text-black text-xs text-center">
        <p>COPYRIGHT © 2019 TALENT EDUCATION. ALL RIGHTS RESERVED.</p>
        <p className="mt-1">POWERED BY: <span className="text-blue-400">UNIQUEDOTZ</span></p>
      </div>
    </div>
  );
};

export default Footer;
