import React, { useState, useEffect, use } from "react";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import supabase from "../src/config/supabaseClient";
import { useAuth } from "../src/AuthContext";
import {
  Search,
  X,
  Filter,
  Package,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [allResults, setAllResults] = useState([]); // store full unfiltered results

  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Replace your existing useEffect with this
  useEffect(() => {
    if (!currentUser) return; // ensure user is loaded before fetchingd
    fetchAll();
  }, [currentUser]);

  // When filter tab changes with no search query, filter allResults by type
  useEffect(() => {
    if (activeFilter === "all") {
      setResults(searchQuery ? results : allResults);
      return;
    }

    const typeMap = { lost: "lost", found: "found", claims: "claim" };
    const filtered = allResults.filter((r) => r.type === typeMap[activeFilter]);
    setResults(filtered);
  }, [activeFilter]); // Add this separate function above it
  const fetchAll = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      let combinedResults = [];

      const { data: lostData } = await supabase
        .from("lost_items")
        .select(`*`)
        .order("created_at", { ascending: false });

      console.log("Lost data:", lostData); // ✅ add this
      // console.log("Lost error:", lostError); // ✅ add this

      if (lostData) {
        combinedResults = [
          ...combinedResults,
          ...lostData.map((item) => ({ ...item, type: "lost" })),
        ];
      }

      const { data: foundData } = await supabase
        .from("found_items")
        .select(`*`)
        .order("created_at", { ascending: false });

      console.log("Found data:", foundData); // ✅ add this
      // console.log("Found error:", foundError); // ✅ add this
      if (foundData) {
        combinedResults = [
          ...combinedResults,
          ...foundData.map((item) => ({ ...item, type: "found" })),
        ];
      }

      const { data: claimsData, error: claimsError } = await supabase
        .from("claims")
        .select("*")
        .eq("claimer_id", currentUser.id)
        .order("created_at", { ascending: false });

      console.log("Claims data:", claimsData); // ✅ add this
      console.log("Claims error:", claimsError); // ✅ add this

      if (claimsData) {
        const claimsWithItems = await Promise.all(
          claimsData.map(async (claim) => {
            const { data: itemData } = await supabase
              .from("found_items")
              .select("item_name, image_url, location")
              .eq("id", claim.item_id)
              .single();
            return { ...claim, item: itemData, type: "claim" };
          }),
        );
        combinedResults = [...combinedResults, ...claimsWithItems];
      }

      console.log("All combined results:", combinedResults); // ✅ add this

      setAllResults(combinedResults);
      setResults(combinedResults);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the search useEffect to filter locally instead of hitting Supabase again
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults(allResults); // show everything when search is cleared
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    const filtered = allResults.filter((result) => {
      const isClaim = result.type === "claim";
      const name = isClaim ? result.item?.item_name : result.item_name;
      const desc = isClaim ? result.claimer_note : result.description;
      const loc = isClaim ? result.item?.location : result.location;

      return (
        name?.toLowerCase().includes(query) ||
        desc?.toLowerCase().includes(query) ||
        loc?.toLowerCase().includes(query) ||
        result.category?.toLowerCase().includes(query)
      );
    });

    // Apply filter tab on top of search
    const tabFiltered =
      activeFilter === "all"
        ? filtered
        : filtered.filter((r) => {
            if (activeFilter === "claims") return r.type === "claim";
            return r.type === activeFilter;
          });

    setResults(tabFiltered);
  }, [searchQuery, activeFilter, allResults]);

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

  const getTypeBadge = (type) => {
    const styles = {
      lost: "bg-red-100 text-red-700",
      found: "bg-green-100 text-green-700",
      claim: "bg-yellow-100 text-yellow-700",
    };
    const labels = {
      lost: "Lost Item",
      found: "Found Item",
      claim: "My Claim",
    };
    return { style: styles[type], label: labels[type] };
  };

  const handleViewItem = (result) => {
    if (result.type === "lost") navigate(`/lost-item-detail/${result.id}`);
    else if (result.type === "found")
      navigate(`/found-item-detail/${result.id}`);
    else if (result.type === "claim")
      navigate(`/found-item-detail/${result.item_id}`);
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "lost", label: "Lost Items" },
    { key: "found", label: "Found Items" },
    { key: "claims", label: "My Claims" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        {/* Add pt-20 for small screens to offset fixed navbar, remove on md+ */}
        <main className="flex-1 p-6 md:ml-64 mt-3 pt-20 md:pt-0">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-gray-500 font-semibold">
              Search
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Find an Item
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Search across all lost items, found items, and your claims.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, category, location, description..."
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-sm bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                  setHasSearched(false);
                }}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            <Filter className="h-5 w-5 text-gray-400 mt-2" />
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? "bg-verde text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-300 hover:border-verde hover:text-verde"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Searching...</div>
          ) : !hasSearched ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                Start typing to search for items
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No results found for "{searchQuery}"
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try a different keyword or filter
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => {
                  const { style, label } = getTypeBadge(result.type);
                  const isClaim = result.type === "claim";
                  return (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        <img
                          src={
                            isClaim ? result.item?.image_url : result.image_url
                          }
                          alt={
                            isClaim ? result.item?.item_name : result.item_name
                          }
                          className="w-full h-full object-cover"
                        />
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${style}`}
                          >
                            {label}
                          </span>
                        </div>
                        {/* Category Badge */}
                        {result.category && (
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(result.category)}`}
                            >
                              {result.category.charAt(0).toUpperCase() +
                                result.category.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Card Body */}
                      <div className="p-5">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">
                          {isClaim
                            ? result.item?.item_name || "Unknown Item"
                            : result.item_name}
                        </h2>
                        <div className="space-y-2 mb-4">
                          {/* Location */}
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">
                                Location
                              </p>
                              <p className="text-sm text-gray-700">
                                {isClaim
                                  ? result.item?.location || "—"
                                  : result.location}
                              </p>
                            </div>
                          </div>
                          {/* Date */}
                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">
                                {result.type === "lost"
                                  ? "Date Lost"
                                  : result.type === "found"
                                    ? "Date Found"
                                    : "Claimed On"}
                              </p>
                              <p className="text-sm text-gray-700">
                                {new Date(
                                  result.type === "lost"
                                    ? result.date_lost
                                    : result.type === "found"
                                      ? result.date_found
                                      : result.created_at,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          {/* Description */}
                          <div className="flex items-start gap-2">
                            <Package className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">
                                {isClaim ? "Your Claim Note" : "Description"}
                              </p>
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {isClaim
                                  ? result.claimer_note
                                  : result.description}
                              </p>
                            </div>
                          </div>
                          {/* Reporter name for lost/found */}
                          {!isClaim && result.profiles && (
                            <p className="text-xs text-gray-400 mt-1">
                              Reported by{" "}
                              <span className="font-semibold text-gray-600">
                                {result.profiles.first_name}{" "}
                                {result.profiles.last_name}
                              </span>
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewItem(result)}
                          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors text-sm text-white ${
                            result.type === "lost"
                              ? "bg-verde hover:bg-verde/90"
                              : "bg-rouge hover:bg-rouge/90"
                          }`}
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
