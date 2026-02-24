import React, { useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const categories = {
  "Diagnostic Tools": [
    "Thermometer",
    "Blood Pressure Monitor",
    "Glucometer",
    "Pulse Oximeter",
    "Stethoscope",
  ],
  "Emergency & First Aid Supplies": [
    "Bandages",
    "Gauze",
    "Gloves",
    "Cotton Rolls",
    "Masks",
    "Ice Packs",
    "Medical Tape",
  ],
  "Infection Control & Sterilization Supplies": [
    "Disinfectants",
    "Hand Sanitizers",
    "PPE Kits",
    "Isolation Gowns",
    "Surface Cleaners",
  ],
  "General Utility Supplies": [
    "Scissors",
    "Tweezers",
    "Kidney Tray",
    "Waste Bags",
    "Syringes",
    "Needles",
  ],
};

const categoryList = Object.keys(categories);

const sampleItems = [
  { id: 1, name: "Thermometer", category: "Diagnostic Tools", quantity: 8, expiryDate: "2026-03-01" },
  { id: 2, name: "Blood Pressure Monitor", category: "Diagnostic Tools", quantity: 4, expiryDate: "—" },
  { id: 3, name: "Glucometer", category: "Diagnostic Tools", quantity: 15, expiryDate: "—" },
  { id: 4, name: "Bandages", category: "Emergency & First Aid Supplies", quantity: 30, expiryDate: "2025-09-01" },
  { id: 5, name: "Gauze", category: "Emergency & First Aid Supplies", quantity: 6, expiryDate: "2024-12-02" },
  { id: 6, name: "Gloves", category: "Emergency & First Aid Supplies", quantity: 3, expiryDate: "2025-05-15" },
  { id: 7, name: "Disinfectants", category: "Infection Control & Sterilization Supplies", quantity: 18, expiryDate: "2026-01-10" },
  { id: 8, name: "Hand Sanitizers", category: "Infection Control & Sterilization Supplies", quantity: 2, expiryDate: "2024-10-05" },
  { id: 9, name: "Scissors", category: "General Utility Supplies", quantity: 12, expiryDate: "—" },
  { id: 10, name: "Syringes", category: "General Utility Supplies", quantity: 25, expiryDate: "2026-09-01" },
];

const NurseEquipment = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [requestedIds, setRequestedIds] = useState([]);

  const currentCategory = categoryList[currentPage];

  const filtered = sampleItems
    .filter((i) => i.category === currentCategory)
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const isConsumable = (categoryName) =>
    categoryName === "Emergency & First Aid Supplies" ||
    categoryName === "Infection Control & Sterilization Supplies";

  const isLowStock = (item) => {
    // Define low stock thresholds (conservative): consumables threshold higher
    const threshold = isConsumable(item.category) ? 10 : 5;
    return item.quantity <= threshold;
  };

  const sendRequest = (item) => {
    if (!isLowStock(item)) return;
    setRequestedIds((prev) => [...prev, item.id]);
    // In real app: call API to notify store/manager
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Equipment Overview (Nurse)</h1>

      <div className="flex justify-between mb-6 items-center gap-4">
        <div className="flex items-center bg-white px-4 py-2 shadow rounded-md w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            className="w-full focus:outline-none"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="text-sm text-gray-500">Read-only view — use row action to request refill</div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">{currentCategory}</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3">Equipment</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Expiry</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => {
              const low = isLowStock(item);
              const requested = requestedIds.includes(item.id);

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className={`p-3 ${low ? "text-red-600 font-semibold" : ""}`}>{item.quantity}</td>
                  <td className="p-3">{item.expiryDate}</td>
                  <td className="p-3 flex justify-center">
                    <button
                      className={`px-3 py-1 rounded-md flex items-center gap-2 text-sm ${
                        requested
                          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                          : low
                          ? "bg-blue-900 text-white hover:bg-blue-800"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!low || requested}
                      onClick={() => sendRequest(item)}
                      title={
                        requested
                          ? "Request sent"
                          : low
                          ? "Request equipment refill"
                          : "Stock sufficient"
                      }
                    >
                      <FaBell /> {requested ? "Requested" : "Request"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-600 p-5 font-bold">
                  No equipment found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          {categoryList.map((cat, i) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded ${i === currentPage ? "bg-blue-900 text-white" : "bg-gray-100"}`}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === categoryList.length - 1}
          className="px-4 py-2 bg-blue-900 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(categoryList.length - 1, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NurseEquipment;
