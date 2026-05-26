import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashbar from "../src/dashbar";
import Navbar from "../src/Navbar";
import StatCard from "../src/StatCard";
import { useAuth } from "../src/AuthContext";
import {
  PackageSearch,
  Package,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
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

  // New: Recent items/claims state
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

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

  // Fetch recent lost/found/claims
  useEffect(() => {
    async function fetchRecent() {
      setLoadingRecent(true);
      // Recent lost items
      const { data: lost } = await supabase
        .from("lost_items")
        .select("id, item_name, location, date_lost")
        .order("date_lost", { ascending: false })
        .limit(3);

      // Recent found items
      const { data: found } = await supabase
        .from("found_items")
        .select("id, item_name, location, date_found")
        .order("date_found", { ascending: false })
        .limit(3);

      // Recent claims for this user
      let claimsData = [];
      if (currentUser) {
        const { data: claimsRaw } = await supabase
          .from("claims")
          .select("id, item_id, item_type, claimer_note, created_at")
          .eq("claimer_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(3);

        claimsData = await Promise.all(
          (claimsRaw || []).map(async (claim) => {
            let item = null;
            if (claim.item_type === "lost") {
              const { data } = await supabase
                .from("lost_items")
                .select("item_name, location, date_lost")
                .eq("id", claim.item_id)
                .single();
              item = data;
            } else {
              const { data } = await supabase
                .from("found_items")
                .select("item_name, location, date_found")
                .eq("id", claim.item_id)
                .single();
              item = data;
            }
            return { ...claim, item };
          }),
        );
      }

      setRecentLost(lost || []);
      setRecentFound(found || []);
      setRecentClaims(claimsData || []);
      setLoadingRecent(false);
    }
    fetchRecent();
  }, [currentUser]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 p-6 md:ml-64 mt-3">
          <h1 className="text-2xl md:text-3xl font-bold text-left text-gray-900">
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

          {/* --- Recent Cards Section --- */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Lost Items */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Lost Items
                </h2>
                <button
                  onClick={() => navigate("/lost-items")}
                  className="flex items-center gap-1 text-verde hover:underline text-sm font-medium"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {loadingRecent ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : recentLost.length === 0 ? (
                <div className="text-gray-400 text-sm">No lost items.</div>
              ) : (
                <ul className="space-y-3">
                  {recentLost.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {item.item_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.location} &middot; {formatDate(item.date_lost)}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/lost-item-detail/${item.id}`)}
                        className="ml-2 px-3 py-1 bg-verde text-white rounded-lg text-xs font-semibold hover:bg-verde/90"
                      >
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Found Items */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Found Items
                </h2>
                <button
                  onClick={() => navigate("/found-items")}
                  className="flex items-center gap-1 text-verde hover:underline text-sm font-medium"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {loadingRecent ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : recentFound.length === 0 ? (
                <div className="text-gray-400 text-sm">No found items.</div>
              ) : (
                <ul className="space-y-3">
                  {recentFound.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {item.item_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.location} &middot; {formatDate(item.date_found)}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/found-item-detail/${item.id}`)
                        }
                        className="ml-2 px-3 py-1 bg-verde text-white rounded-lg text-xs font-semibold hover:bg-verde/90"
                      >
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* My Recent Claims - full width below on large screens */}
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  My Recent Claims
                </h2>
                <button
                  onClick={() => navigate("/claims")}
                  className="flex items-center gap-1 text-verde hover:underline text-sm font-medium"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {loadingRecent ? (
                <div className="text-gray-400 text-sm">Loading...</div>
              ) : recentClaims.length === 0 ? (
                <div className="text-gray-400 text-sm">No claims yet.</div>
              ) : (
                <ul className="space-y-3">
                  {recentClaims.map((claim) => (
                    <li
                      key={claim.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {claim.item?.item_name || "Unknown Item"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {claim.item?.location || "Unknown Location"} &middot;{" "}
                          {formatDate(
                            claim.item?.date_lost || claim.item?.date_found,
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            claim.item_type === "lost"
                              ? `/lost-item-detail/${claim.item_id}`
                              : `/found-item-detail/${claim.item_id}`,
                          )
                        }
                        className="ml-2 px-3 py-1 bg-verde text-white rounded-lg text-xs font-semibold hover:bg-verde/90"
                      >
                        Open
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
