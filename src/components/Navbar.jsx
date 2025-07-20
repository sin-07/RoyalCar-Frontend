import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, requireLogin } =
    useAppContext();

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-10 lg:px-10 xl:px-10 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" && "bg-light"
      }`}
    >
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.royalcarslogo}
          alt="logo"
          className="h-11"
        />
        

      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 max-sm:shadow-lg ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => {
          const isActive = location.pathname === link.path || 
                          (link.path === '/cars' && location.pathname.startsWith('/cars')) ||
                          (link.path === '/my-bookings' && location.pathname.startsWith('/my-bookings'));
          
          return (
            <Link 
              key={index} 
              to={link.path}
              onClick={(e) => {
                // Check if route requires authentication
                const protectedRoutes = ['/cars', '/my-bookings'];
                if (protectedRoutes.includes(link.path) && !user) {
                  e.preventDefault();
                  requireLogin('Please login to access this page', link.path);
                } else {
                  // Hide mobile menu when a link is clicked
                  setOpen(false);
                }
              }}
              className={`transition-all duration-200 hover:text-green-600 font-medium ${
                isActive 
                  ? 'text-green-600 font-semibold' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          {isOwner && (
            <button
              onClick={() => {
                navigate("/owner");
                setOpen(false); // Hide mobile menu
              }}
              className={`cursor-pointer font-medium transition-all duration-200 ${
                location.pathname.startsWith('/owner')
                  ? 'text-green-600 font-semibold'
                  : 'text-green-600 hover:text-green-700'
              }`}
            >
              Dashboard
            </button>
          )}

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
              setOpen(false); // Hide mobile menu
            }}
            className="cursor-pointer px-8 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all text-white font-bold rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;
