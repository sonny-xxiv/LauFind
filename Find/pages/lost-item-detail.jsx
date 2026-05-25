import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../src/AuthContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import supabase from "../src/config/supabaseClient";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";

const LostItemDetail = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [foundConfirmed, setFoundConfirmed] = useState(false);
  const [item, setItem] = useState(null);
  const [reporter, setReporter] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // ✅ Fetch item and reporter profile from Supabase
  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from("lost_items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (error) {
        console.error("Error fetching item:", error.message);
        setLoading(false);
        return;
      }

      setItem(data);

      // Fetch the profile of whoever reported this item
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", data.user_id)
        .single();

      if (profileData) setReporter(profileData);

      setLoading(false);
    }

    fetchItem();
  }, [itemId]);

  const handleFoundThisItem = async () => {
    setFoundConfirmed(true);

    // ✅ Update the item status to "found" in Supabase
    const { error } = await supabase
      .from("lost_items")
      .update({ status: "found" })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating item status:", error.message);
      return;
    }

    setTimeout(() => {
      alert(
        "Thank you for reporting that you found this item! The item owner will be contacted.",
      );
      navigate("/lost-items");
    }, 1500);
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

  // Loading state
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

  // Item not found state
  if (!item) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1">
          <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className="flex-1 p-6 md:ml-64 mt-3">
            <div className="text-center">
              <p className="text-gray-600 text-lg">Item not found</p>
              <button
                onClick={() => navigate("/lost-items")}
                className="mt-4 inline-block text-verde hover:underline"
              >
                Back to Lost Items
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
            <div className="mb-8">
              <button
                onClick={() => navigate("/lost-items")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back to Lost Items</span>
              </button>
            </div>

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
                        {item.item_name} {/* ✅ Supabase column */}
                      </h1>
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getCategoryBadgeColor(item.category)}`}
                      >
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 border-t border-gray-200 pt-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="h-5 w-5 text-verde" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Location Lost
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {item.location}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-verde" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Date Lost
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {new Date(item.date_lost).toLocaleDateString("en-US", {
                          /* ✅ Supabase column */ weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-verde" />
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
                        <User className="h-5 w-5 text-verde" />
                        <h3 className="text-sm font-semibold text-gray-700 uppercase">
                          Reported By
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {/* ✅ Real name from profiles table */}
                        {reporter
                          ? `${reporter.first_name} ${reporter.last_name}`
                          : "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Action Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Did you find this item?
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    If you've located this lost item, please click the button
                    below to notify the owner and help return it.
                  </p>

                  {!foundConfirmed ? (
                    <button
                      onClick={handleFoundThisItem}
                      className="w-full flex items-center justify-center gap-2 bg-verde hover:bg-verde/90 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      <CheckCircle className="h-5 w-5" />I Found This Item
                    </button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="font-semibold text-green-800">
                          Thank You!
                        </p>
                      </div>
                      <p className="text-sm text-green-700">
                        The item owner will be notified about your report.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      About This Report
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-verde mt-1">•</span>
                        <span>
                          Reported as lost on{" "}
                          {new Date(item.date_lost).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-verde mt-1">•</span>
                        <span>
                          Contact the owner by clicking "I Found This Item"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-verde mt-1">•</span>
                        <span>
                          You will be able to communicate with the item owner
                        </span>
                      </li>
                    </ul>
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

export default LostItemDetail;
