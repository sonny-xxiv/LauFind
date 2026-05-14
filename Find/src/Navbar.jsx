import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Menu } from "lucide-react";

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button and Laufind Logo/Name */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <div className="text-2xl md:text-4xl cursor-pointer font-bold text-gray-800">
            Laufind
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <User size={20} className="text-gray-600" />
            <span className="text-gray-700 font-medium">
              {currentUser?.firstName || "User"}
            </span>
          </button>

          {/* Dropdown Card */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>

              {/* Settings Option */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                <Settings size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Settings</span>
              </button>

              {/* Sign Out Option */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition duration-200 border-t border-gray-200"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
