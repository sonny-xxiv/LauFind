import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashbar from "../src/dashbar";
import Navbar from "../src/Navbar";
import StatCard from "../src/StatCard";
import { useAuth } from "../src/AuthContext";
import { PackageSearch, Package, ClipboardCheck } from "lucide-react";
import supabase from "../src/config/supabaseClient";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    openLostItems: 0,
    foundItems: 0,
    myClaims: 0,
  });

  // Fetch profile for first name
  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", currentUser.id)
        .single();
      if (data) setProfile(data);
    }
    fetchProfile();
  }, [currentUser]);

  // Fetch stats counts
  useEffect(() => {
    async function fetchStats() {
      if (!currentUser) return;

      // Count open lost items (all users)
      const { count: lostCount } = await supabase
        .from("lost_items")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      // Count available found items (all users)
      const { count: foundCount } = await supabase
        .from("found_items")
        .select("*", { count: "exact", head: true })
        .eq("status", "available");

      // Count this user's own lost item reports as "my claims"
      const { count: myCount } = await supabase
        .from("lost_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id);

      setStats({
        openLostItems: lostCount || 0,
        foundItems: foundCount || 0,
        myClaims: myCount || 0,
      });
    }

    fetchStats();
  }, [currentUser]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 p-6 md:ml-64 mt-3">
          <h1 className="text-2xl md:text-3xl font-bold text-left text-gray-900">
            {/* ✅ First name from profiles table */}
            Welcome back, {profile?.first_name || "User"}!
          </h1>
          <p className="text-gray-700 text-sm md:text-left">
            Here's what's new with your account:
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/report-lost-item")}
              className="p-3 w-40 rounded-lg text-white bg-verde text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-verde/90 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => navigate("/report-found-item")}
              className="p-3 w-40 rounded-lg text-rouge bg-white border-2 border-rouge text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-rouge hover:text-white hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Report Found Item
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <StatCard
              title="Open Lost Items"
              value={stats.openLostItems}
              subtitle="Items waiting to be found"
              Icon={PackageSearch}
              iconClass="text-verde"
            />
            <StatCard
              title="Found Items Available"
              value={stats.foundItems}
              subtitle="Items ready to be claimed"
              Icon={Package}
              iconClass="text-rouge"
            />
            <StatCard
              title="My Reports"
              value={stats.myClaims}
              subtitle="Total items you've reported"
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
