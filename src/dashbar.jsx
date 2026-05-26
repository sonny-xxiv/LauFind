import React from "react";
import {
  LayoutDashboard,
  PackageSearch,
  Package,
  Search,
  ClipboardCheck,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", Icon: LayoutDashboard },
  { label: "Lost Items", Icon: PackageSearch },
  { label: "Found Items", Icon: Package },
  { label: "Search", Icon: Search },
  { label: "Claims", Icon: ClipboardCheck },
];
import { Link, useNavigate } from "react-router-dom";
const Dashbar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 bottom-0 top-0 w-60 bg-primary shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex flex-col text-xs h-full">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/dashboard"
              className="text-white text-3xl cursor-pointer font-semibold"
            >
              LauFind
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition duration-200"
              aria-label="Close menu"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          <hr className="mb-5 border-white w-full" />
          <nav className="space-y-2">
            {navItems.map(({ label, Icon }) => {
              let route = "/dashboard";
              if (label === "Lost Items") route = "/lost-items";
              if (label === "Found Items") route = "/found-items";
              if (label === "Search") route = "/search";
              if (label === "Claims") route = "/claims";

              return (
                <Link
                  key={label}
                  to={route}
                  onClick={onClose}
                  className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left text-white hover:bg-white/30 transition"
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Dashbar;
