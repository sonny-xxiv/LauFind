import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/AuthContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import { ArrowLeft, Package, MapPin, Calendar, FileText } from "lucide-react";

const ReportLostItem = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    dateLost: "",
    location: "",
  });

  const categories = [
    "electronics",
    "clothing",
    "accessories",
    "books",
    "documents",
    "keys",
    "bags",
    "sports",
    "others",
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Lost item report:", formData);
    // For now, just navigate back to dashboard
    navigate("/dashboard");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1">
        <Dashbar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 md:ml-64 mt-3">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Report Lost Item
              </h1>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                Help us find your lost item by providing detailed information.
                The more details you provide, the better our chances of
                recovery.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-4xl bg-white p-8 shadow-lg border border-gray-200">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Item Name */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="itemName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Item Name *
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="itemName"
                        name="itemName"
                        required
                        value={formData.itemName}
                        onChange={handleInputChange}
                        placeholder="e.g., blue black pack, iPhone 14, Student ID Card etc"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors bg-white"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Lost */}
                  <div>
                    <label
                      htmlFor="dateLost"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Date Lost *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        id="dateLost"
                        name="dateLost"
                        required
                        value={formData.dateLost}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Location Lost *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Library, Cafeteria, Classroom 101, Parking Lot etc"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Provide any additional details that might help identify your item (color, brand, distinguishing features, etc.)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors resize-vertical"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-verde text-white rounded-lg hover:bg-verde/90 transition-colors font-medium"
                >
                  Report Lost Item
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportLostItem;
