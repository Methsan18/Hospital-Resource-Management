import React, { useState } from "react";
import { FaPlus, FaFileImport, FaSearch, FaEdit, FaEye } from "react-icons/fa";
import { MdLocalPharmacy } from "react-icons/md";

const StockManagement = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Dummy Data (You can replace with API response)
  const stockData = [
    {
      id: 1,
      name: "Paracetamol",
      category: "Pain Relief",
      batch: "B123",
      qty: 120,
      expiry: "2025-03-12",
      status: "Green",
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Antibiotic",
      batch: "AB876",
      qty: 18,
      expiry: "2024-09-01",
      status: "Yellow",
    },
    {
      id: 3,
      name: "Insulin",
      category: "Hormone",
      batch: "IN789",
      qty: 5,
      expiry: "2024-03-21",
      status: "Red",
    },
  ];

  const filteredData = stockData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "All" ? true : item.category === category;
    return matchSearch && matchCategory;
  });

  const getStatusColor = (status) => {
    if (status === "Green") return "bg-green-500";
    if (status === "Yellow") return "bg-yellow-500";
    if (status === "Red") return "bg-red-600";
  };

  return (
    <div className="p-6 lg:p-10 bg-gray-100 min-height-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MdLocalPharmacy className="text-blue-800 text-4xl" />
        <h1 className="text-3xl font-bold text-gray-800">
          Stock Management
        </h1>
      </div>

      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">

        {/* Search Bar */}
        <div className="flex items-center bg-white px-4 py-2 shadow rounded-md w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search medicine..."
            className="w-full focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="px-4 py-2 bg-white shadow rounded-md border border-gray-300"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Pain Relief</option>
          <option>Antibiotic</option>
          <option>Hormone</option>
          <option>Respiratory</option>
          <option>Vitamin</option>
        </select>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button className="bg-blue-800 text-white px-4 py-2 rounded-md shadow hover:bg-blue-900 flex items-center gap-2">
            <FaPlus /> Add Medicine
          </button>

          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 flex items-center gap-2">
            <FaFileImport /> Import Stock
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-3">Medicine Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Batch No</th>
              <th className="p-3">Current Qty</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.batch}</td>
                <td className="p-3">{item.qty}</td>
                <td className="p-3">{item.expiry}</td>

                {/* Status Badge */}
                <td className="p-3">
                  <span
                    className={`text-white px-3 py-1 rounded-full text-sm ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-3 flex justify-center gap-3">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
                    <FaEdit /> Edit
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-600 p-5 font-bold"
                >
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
