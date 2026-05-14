import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashbar from "../src/dashbar";
import Navbar from "../src/Navbar";
import StatCard from "../src/StatCard";
import { useAuth } from "../src/AuthContext";
import { PackageSearch, Package, ClipboardCheck } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleReportLostItem = () => {
    navigate("/report-lost-item");
  };

  const handleReportFoundItem = () => {
    navigate("/report-found-item");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 p-6 md:ml-64 mt-3">
          <h1 className="text-2xl md:text-3xl font-bold text-left text-gray-900">
            Welcome back, {currentUser?.firstName || "User"}!
          </h1>
          <p className="text-gray-700 text-sm md:text-left">
            Here's what's new with your account:
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={handleReportLostItem}
              className="p-3 w-40 rounded-lg text-white bg-verde text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-verde/90 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-verde/50"
            >
              Report Lost Item
            </button>
            <button
              onClick={handleReportFoundItem}
              className="p-3 w-40 rounded-lg text-rouge bg-white border-2 border-rouge text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-rouge hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rouge/50"
            >
              Report Found Item
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <StatCard
              title="Open Lost Items"
              value={0}
              subtitle="Items waiting to be found"
              Icon={PackageSearch}
              iconClass="text-verde"
            />
            <StatCard
              title="Found Items Available"
              value={0}
              subtitle="Items ready to be claimed"
              Icon={Package}
              iconClass="text-rouge"
            />
            <StatCard
              title="My Claims"
              value={0}
              subtitle="Total claims submitted"
              Icon={ClipboardCheck}
              iconClass="text-sky-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
