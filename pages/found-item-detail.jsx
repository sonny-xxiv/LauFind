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
  X,
} from "lucide-react";

const FoundItemDetail = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [foundConfirmed, setFoundConfirmed] = useState(false);
  const [item, setItem] = useState(null);
  const [reporter, setReporter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [claimDescription, setClaimDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from("found_items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (error) {
        console.error("Error fetching item:", error.message);
        setLoading(false);
        return;
      }

      setItem(data);

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

  // Opens the modal
  const handleFoundThisItem = () => {
    setShowModal(true);
  };

  // Called when user submits the modal form
  const handleSubmitClaim = async () => {
    if (!claimDescription.trim()) {
      alert("Please provide a description to verify your claim.");
      return;
    }

    setSubmitting(true);

    // 1. Update found_items status
    const { error: updateError } = await supabase
      .from("found_items")
      .update({
        status: "claimed",
        claimer_note: claimDescription,
        claimer_id: currentUser.id,
      })
      .eq("id", itemId);

    if (updateError) {
      console.error("Error updating item:", updateError.message);
      setSubmitting(false);
      return;
    }

    // 2. Insert into claims table
    const { error: claimError } = await supabase.from("claims").insert({
      item_id: itemId,
      item_type: "found",
      claimer_id: currentUser.id,
      claimer_note: claimDescription,
      status: "pending",
    });

    if (claimError) {
      console.error("Error saving claim:", claimError.message);
      setSubmitting(false);
      return;
    }

    setShowModal(false);
    setFoundConfirmed(true);
    setSubmitting(false);

    setTimeout(() => {
      alert("Thank you! The reporter will be contacted.");
      navigate("/found-items");
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1">
          <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className="flex-1 p-6 md:ml-64 mt-3 text-gray-500">
            Loading found item details...
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
              <p className="text-gray-600 text-lg">Found item not found</p>
              <button
                onClick={() => navigate("/found-items")}
                className="mt-4 text-verde hover:underline"
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
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
                  <img
                    src={item.image_url}
                    alt={item.item_name}
                    className="w-full h-96 object-cover"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {item.item_name}
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
                          Location Found
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
                          Date Found
                        </h3>
                      </div>
                      <p className="text-lg text-gray-900 ml-8">
                        {new Date(
                          item.date_found || item.date_lost,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
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
                        {item.profiles
                          ? `${item.profiles.first_name} ${item.profiles.last_name}`
                          : "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Did you claim this item?
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    If you are the rightful owner of this found item, please
                    click the button below to notify the reporter and help
                    recover it.
                  </p>

                  {!foundConfirmed ? (
                    <button
                      onClick={handleFoundThisItem}
                      className="w-full flex items-center justify-center gap-2 bg-verde hover:bg-verde/90 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                      <CheckCircle className="h-5 w-5" />I am the Owner
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
                        The reporter will be notified about your claim.
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
                          Reported as found on{" "}
                          {new Date(
                            item.date_found || item.date_lost,
                          ).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-verde mt-1">•</span>
                        <span>
                          Click "I am the Owner" to notify the reporter
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-verde mt-1">•</span>
                        <span>You will be connected with the reporter</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                Verify Your Claim
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Please describe the item, any distinguishing features, or other
              proof to help verify your claim.
            </p>

            {/* Textarea */}
            <textarea
              rows={4}
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              placeholder="e.g. I am the owner of this item because..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors resize-none text-sm"
            />

            {/* Modal Buttons */}
            <button
              onClick={handleSubmitClaim}
              disabled={submitting}
              className="w-full mt-4 bg-verde hover:bg-verde/90 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Claim"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItemDetail;
