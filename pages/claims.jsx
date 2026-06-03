import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/AuthContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import supabase from "../src/config/supabaseClient";
import { ClipboardCheck, Calendar, ArrowRight, Package } from "lucide-react";

const Claims = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    async function fetchClaims() {
      if (!currentUser) return;

      console.log("Current User ID:", currentUser.id); // Debug log

      // Fetch all claims by this user
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .eq("claimer_id", currentUser.id)
        .order("created_at", { ascending: false });

      console.log("Claims Data:", data); // Debug log
      console.log("Claims Error:", error); // Debug log

      if (error) {
        console.error("Error fetching claims:", error.message);
        setLoading(false);
        return;
      }

      // For each claim, fetch the item details
      const claimsWithItems = await Promise.all(
        data.map(async (claim) => {
          const { data: itemData } = await supabase
            .from("found_items")
            .select("item_name, image_url, location")
            .eq("id", claim.item_id)
            .single();

          return { ...claim, item: itemData };
        }),
      );

      setClaims(claimsWithItems);
      setLoading(false);
    }

    fetchClaims();
  }, [currentUser]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 md:ml-64 mt-3 pt-20 md:pt-0">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-gray-500 font-semibold">
              My Activity
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">My Claims</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track all the items you have submitted a claim for.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading your claims...
            </div>
          ) : claims.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Header */}
                  <div className="bg-rouge/10 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-rouge" />
                      <span className="text-sm font-bold text-rouge">
                        Found Item Claim
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(claim.status)}`}
                    >
                      {claim.status}
                    </span>
                  </div>
                  {/* Item Image */}
                  {claim.item?.image_url && (
                    <div className="h-36 bg-gray-100 overflow-hidden">
                      <img
                        src={claim.item.image_url}
                        alt={claim.item?.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Item Name */}
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                      {claim.item?.item_name || "Unknown Item"}
                    </h2>

                    {/* Submission Date */}
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Submitted
                        </p>
                        <p className="text-sm text-gray-700">
                          {new Date(claim.created_at).toLocaleDateString(
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

                    {/* Claim Description */}
                    <div className="flex items-start gap-2 mb-4">
                      <Package className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Your Description
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {claim.claimer_note}
                        </p>
                      </div>
                    </div>

                    {/* View Item Button */}
                    <button
                      onClick={() =>
                        navigate(`/found-item-detail/${claim.item_id}`)
                      }
                      className="w-full flex items-center justify-center gap-2 bg-rouge hover:bg-rouge/90 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                    >
                      <span>View Item</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                You haven't submitted any claims yet.
              </p>
              <button
                onClick={() => navigate("/found-items")}
                className="mt-4 text-rouge hover:underline text-sm font-medium"
              >
                Browse Found Items
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Claims;
