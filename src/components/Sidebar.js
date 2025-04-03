import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div>
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden p-4 bg-gray-800 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen bg-gray-800 text-white w-64 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold">Inventory System</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/users" onClick={() => setIsOpen(false)}>
                Users
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/products" onClick={() => setIsOpen(false)}>
                Products
              </Link>
            </li>
            <li
              className="p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              Logout
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for Mobile when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
