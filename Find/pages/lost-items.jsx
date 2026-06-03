import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/AuthContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import supabase from "../src/config/supabaseClient";
import { Package, MapPin, Calendar, ArrowRight } from "lucide-react";

const LostItems = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ✅ Fetch lost items from Supabase
  useEffect(() => {
    async function fetchLostItems() {
      const { data, error } = await supabase
        .from("lost_items")
        .select("*")
        // .select("profiles(first_name, last_name)")
        .order("created_at", { ascending: false }); // newest first

      if (error) {
        console.error("Error fetching lost items:", error.message);
      } else {
        setLostItems(data);
      }

      setLoading(false);
    }

    fetchLostItems();
  }, []);

  const handleViewDetails = (itemId) => {
    navigate(`/lost-item-detail/${itemId}`);
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      electronics: "bg-blue-100 text-blue-800",
      clothing: "bg-purple-100 text-purple-800",
      accessories: "bg-pink-100 text-pink-800",
      books: "bg-amber-100 text-amber-800",
      documents: "bg-red-100 text-red-800",
      keys: "bg-indigo-100 text-indigo-800",
      bags: "bg-cyan-100 text-cyan-800",
      sports: "bg-green-100 text-green-800",
      others: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 md:ml-64 mt-3 pt-20 md:pt-0">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold text-gray-900">Lost Items</h1>
              <button
                onClick={() => navigate("/report-lost-item")}
                className="p-3 w-40 rounded-lg text-white bg-verde text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-verde/90 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Report Lost Item
              </button>
            </div>
            <p className="text-gray-600">
              Browse items that have been reported as lost. If you find an item,
              click "Open" to view more details and report that you've found it.
            </p>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading lost items...
            </div>
          ) : lostItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
                >
                  {/* Item Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(item.category)}`}
                      >
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  {/* Card Content */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                      {item.item_name}
                    </h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Location
                          </p>
                          <p className="text-sm text-gray-700">
                            {item.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Date Lost
                          </p>
                          <p className="text-sm text-gray-700">
                            {new Date(item.date_lost).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Description
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-verde hover:bg-verde/90 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No lost items reported yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LostItems;
