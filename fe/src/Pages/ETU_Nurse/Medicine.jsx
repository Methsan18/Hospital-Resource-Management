import React, { useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import { MdLocalPharmacy } from "react-icons/md";

const NurseMedicine = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [remindedIds, setRemindedIds] = useState([]);

  // Dummy Data (keep consistent with Store_Manager/ManageMed.jsx)
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
    {
      id: 4,
      name: "Saline",
      category: "Fluid",
      batch: "S555",
      qty: 45,
      expiry: "2026-01-01",
      status: "Green",
    },
  ];

  const filteredData = stockData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" ? true : item.category === category;
    return matchSearch && matchCategory;
  });

  const getStatusColor = (status) => {
    if (status === "Green") return "bg-green-500";
    if (status === "Yellow") return "bg-yellow-500";
    if (status === "Red") return "bg-red-600";
    return "bg-gray-400";
  };

  const isLowStock = (item) => {
    // Define "near stock out" logic: low qty or non-green status
    const threshold = 20; // configurable threshold
    return item.qty <= threshold || item.status === "Yellow" || item.status === "Red";
  };

  const sendReminder = (item) => {
    if (!isLowStock(item)) return; // no-op if not low
    // Simulate sending reminder (disable button and mark as sent)
    setRemindedIds((prev) => [...prev, item.id]);
    // In a real app, call API here and handle response / errors
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-0">
        
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Medicine Overview (Nurse)</h1>
      </div>

      {/* Top Controls */}
      <div className="flex justify-between mb-6 items-center gap-4">
        {/* Search Bar (read-only to filter only) */}
        <div className="flex items-center bg-white px-4 py-2 shadow rounded-md w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            className="w-full focus:outline-none"
            placeholder="Search medicine..."
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

        {/* Nurse view: no add/import actions */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Read-only for nurses — use row action to send reminders</div>
        </div>
      </div>

      {/* Stock Table */}

      <h2 className="text-2xl font-semibold mb-4">{category === "All" ? "All Medicines" : category}</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3">Medicine Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Batch No</th>
              <th className="p-3">Current Qty</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => {
              const low = isLowStock(item);
              const reminded = remindedIds.includes(item.id);

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.batch}</td>
                  <td className={`p-3 ${low ? 'text-red-600 font-semibold' : ''}`}>{item.qty}</td>
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

                  {/* Action: Send Reminder (enabled only when low stock) */}
                  <td className="p-3 flex justify-center">
                    <button
                      className={`px-3 py-1 rounded-md flex items-center gap-2 text-sm ${
                        reminded
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : low
                          ? "bg-blue-900 text-white hover:bg-blue-800"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!low || reminded}
                      onClick={() => sendReminder(item)}
                      title={
                        reminded
                          ? "Reminder sent"
                          : low
                          ? "Send reminder to procurement / store manager"
                          : "Stock sufficient — no reminder needed"
                      }
                    >
                      <FaBell /> {reminded ? "Reminder Sent" : "Send Reminder"}
                    </button>
                  </td>
                </tr>
              );
            })}

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

export default NurseMedicine;
