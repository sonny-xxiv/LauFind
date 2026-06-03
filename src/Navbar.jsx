import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Menu } from "lucide-react";
import supabase from "./config/supabaseClient";

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch profile when user is available
  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", currentUser.id)
        .single();

      if (!error) setProfile(data);
    }

    fetchProfile();
  }, [currentUser]);

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

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-40 mb-20 md:m-0 md:static md:z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <div className="text-xl md:text-4xl cursor-pointer font-bold text-gray-800">
            Laufind
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <User size={20} className="text-gray-600" />
            {/* ✅ Now reads from profile */}
            <span className="text-gray-700 font-medium">
              {profile?.first_name || "User"}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  {/* ✅ Full name from profile */}
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                <Settings size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Profile</span>
              </button>

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
