import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import supabase from "../src/config/supabaseClient";
import { useAuth } from "../src/AuthContext";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  CheckCircle,
  User,
} from "lucide-react";

const FoundItemDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [reporter, setReporter] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ✅ Profile fetch is now correctly inside the async function
  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching found item:", error.message);
        setLoading(false);
        return;
      }

      setItem(data);

      // ✅ Now inside async function — no red underline
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", data.user_id)
        .single();

      if (profileData) setReporter(profileData);

      setLoading(false);
    }

    fetchItem();
  }, [id]);

  const handleClaimItem = async () => {
    setClaimed(true);

    const { error } = await supabase
      .from("found_items")
      .update({ status: "claimed" })
      .eq("id", id);

    if (error) {
      console.error("Error claiming item:", error.message);
      return;
    }

    setTimeout(() => {
      alert("Your claim has been submitted! The finder will be contacted.");
      navigate("/found-items");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1">
          <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className="flex-1 p-6 md:ml-64 mt-3 text-gray-500">
            Loading item details...
          </main>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1">
          <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className="flex-1 p-6 md:ml-64 mt-3">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Found item not found.</p>
              <button
                onClick={() => navigate("/found-items")}
                className="mt-4 text-rouge hover:underline"
              >
                Back to Found Items
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 md:ml-64 mt-3">
          <div className="max-w-4xl">
            <button
              onClick={() => navigate("/found-items")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Found Items</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2">
                {/* Image */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {item.item_name}
                      </h1>
                      <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-6 border-t border-gray-200 pt-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="h-5 w-5 text-rouge" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Location Found
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {item.location}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-rouge" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Date Found
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {new Date(item.date_found).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-rouge" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Description
                        </h3>
                      </div>
                      <p className="text-gray-900 ml-8 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-rouge" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Reported By
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {reporter
                          ? `${reporter.first_name} ${reporter.last_name}`
                          : "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FoundItemDetail;
