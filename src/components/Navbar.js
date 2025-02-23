import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setRole(userData.Role.role_name);
  }, []);

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">MIDAS Optics</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Dashboard
            </Link>
            {role === "Admin" && (
              <Link
                to="/users"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Users
              </Link>
            )}
            <Link
              to="/invoice"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Invoice
            </Link>
            {/* <Link
              to="/products"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Products
            </Link> */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-400 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden space-y-2 mt-2">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {role === "Admin" && (
              <Link
                to="/users"
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
            )}
            <Link
              to="/invoice"
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Invoice
            </Link>
            {/* <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link> */}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
