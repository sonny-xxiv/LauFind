import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/AuthContext";
import { useItems } from "../src/ItemsContext";
import Navbar from "../src/Navbar";
import Dashbar from "../src/dashbar";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  FileText,
  Warehouse,
  Upload,
  X,
} from "lucide-react";

const ReportFoundItem = () => {
  const { currentUser } = useAuth();
  const { addFoundItem } = useItems();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    dateFound: "",
    locationFound: "",
    storageLocation: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image of the found item");
      return;
    }

    // Create item data with user info
    const itemData = {
      ...formData,
      reportedBy: currentUser?.username || currentUser?.email || "Anonymous",
      reporterEmail: currentUser?.email,
    };

    // Add item to context (saved to localStorage)
    addFoundItem(itemData);

    console.log("Found item report submitted:", itemData);
    alert("Thank you for reporting the found item!");
    navigate("/found-items");
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
                Report Found Item
              </h1>
              <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                Help reunite lost items with their owners by reporting what
                you've found. Your information will help us match found items
                with lost item reports.
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rouge focus:border-rouge transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rouge focus:border-rouge transition-colors bg-white"
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

                  {/* Date Found */}
                  <div>
                    <label
                      htmlFor="dateFound"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Date Found *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        id="dateFound"
                        name="dateFound"
                        required
                        value={formData.dateFound}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rouge focus:border-rouge transition-colors"
                      />
                    </div>
                  </div>

                  {/* Location Found */}
                  <div>
                    <label
                      htmlFor="locationFound"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Location Found *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="locationFound"
                        name="locationFound"
                        required
                        value={formData.locationFound}
                        onChange={handleInputChange}
                        placeholder="e.g., Library, Cafeteria, Classroom 101"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rouge focus:border-rouge transition-colors"
                      />
                    </div>
                  </div>

                  {/* Current Storage Location */}
                  <div>
                    <label
                      htmlFor="storageLocation"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Current Storage Location *
                    </label>
                    <div className="relative">
                      <Warehouse className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="storageLocation"
                        name="storageLocation"
                        required
                        value={formData.storageLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., Lost & Found Office, Security Office"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rouge focus:border-rouge transition-colors"
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
                        placeholder="Provide any additional details that might help identify the owner (color, brand, distinguishing features, condition, etc.)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rouge focus:border-rouge transition-colors resize-vertical"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image of Item *
                  </label>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-verde transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-300">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
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
                  className="px-6 py-3 bg-rouge text-white rounded-lg hover:bg-rouge/90 transition-colors font-medium"
                >
                  Register Found Item
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportFoundItem;
