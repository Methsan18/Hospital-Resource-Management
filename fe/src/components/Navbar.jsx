import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) setIsLoggedIn(true);
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="w-full fixed top-0 bg-white shadow-md z-50">
      <nav className="px-6 lg:px-20 py-4">
        <div className="flex items-center">

          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-700 flex items-center gap-3"
          >
            <img src="./img/logo.png" className="w-12 h-auto" alt="Logo" />
            <span className="hidden md:block">HospitalCare</span>
          </Link>

          {/* MENU ITEMS — pushed to right, not touching edge */}
          <ul className="hidden md:flex items-center space-x-10 ml-auto mr-10">
            <li>
              <Link
                to="/dashboard_patient"
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/docProfile"
                className="text-base font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Doctor Details
              </Link>
            </li>
          </ul>

          {/* LOGIN BUTTON — far right */}
          <div className="flex items-center">
            <button
              onClick={handleAuthAction}
              className={`px-5 py-2 rounded-full text-white font-medium transition
                ${
                  isLoggedIn
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>

            {/* MOBILE MENU ICON */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="md:hidden ml-4 text-blue-700"
            >
              {isMenuOpen ? <FaXmark size={22} /> : <FaBarsStaggered size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-50 mt-4 py-6 px-6 rounded-lg shadow space-y-3">
            <Link
              to="/dashboard_patient"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/docProfile"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600"
            >
              Doctor Details
            </Link>

            
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
