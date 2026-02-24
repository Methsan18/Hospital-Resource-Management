import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdLocalPharmacy } from "react-icons/md";

/* ---------------- MOCK DATA (replace with API later) ---------------- */

// Medicine list (only name + qty)
const medicineStock = [
  { id: 1, name: "Paracetamol", category: "Pain Relief", qty: 120 },
  { id: 2, name: "Amoxicillin", category: "Antibiotic", qty: 18 },
  { id: 3, name: "Insulin", category: "Hormone", qty: 5 },
  { id: 4, name: "Vitamin C", category: "Vitamin", qty: 55 },
  { id: 5, name: "Salbutamol", category: "Respiratory", qty: 22 },
];

// Equipment list (only name + qty)
const equipmentStock = [
  { id: 101, name: "Thermometer", category: "Diagnostic Tools", quantity: 12 },
  { id: 102, name: "Blood Pressure Monitor", category: "Diagnostic Tools", quantity: 7 },
  { id: 103, name: "Gloves", category: "Emergency & First Aid Supplies", quantity: 300 },
  { id: 104, name: "Masks", category: "Emergency & First Aid Supplies", quantity: 500 },
  { id: 105, name: "Hand Sanitizers", category: "Infection Control & Sterilization Supplies", quantity: 40 },
  { id: 106, name: "Syringes", category: "General Utility Supplies", quantity: 250 },
];

const medicineCategories = ["All", ...Array.from(new Set(medicineStock.map((m) => m.category)))];
const equipmentCategories = ["All", ...Array.from(new Set(equipmentStock.map((e) => e.category)))];

const InventoryReadOnly = () => {
  const [tab, setTab] = useState("medicine"); // "medicine" | "equipment"
  const [search, setSearch] = useState("");
  const [medicineCategory, setMedicineCategory] = useState("All");
  const [equipmentCategory, setEquipmentCategory] = useState("All");

  const filteredMedicines = useMemo(() => {
    return medicineStock.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = medicineCategory === "All" ? true : m.category === medicineCategory;
      return matchSearch && matchCategory;
    });
  }, [search, medicineCategory]);

  const filteredEquipments = useMemo(() => {
    return equipmentStock.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = equipmentCategory === "All" ? true : e.category === equipmentCategory;
      return matchSearch && matchCategory;
    });
  }, [search, equipmentCategory]);

  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 lg:p-10 mt-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MdLocalPharmacy className="text-blue-700 text-4xl" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Viewer</h1>
          <p className="text-slate-600 text-sm">
            Read-only access: view medicine & equipment quantities
          </p>
        </div>
      </div>

      {/* Tabs + Search + Category */}
      <div className="bg-white/80 backdrop-blur shadow-md rounded-2xl p-4 mb-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab("medicine")}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                tab === "medicine"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-blue-50"
              }`}
            >
              Medicines
            </button>
            <button
              onClick={() => setTab("equipment")}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                tab === "equipment"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-blue-50"
              }`}
            >
              Equipments
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full lg:w-[360px]">
            <FaSearch className="text-slate-500 mr-2" />
            <input
              type="text"
              placeholder={`Search ${tab === "medicine" ? "medicine" : "equipment"}...`}
              className="w-full outline-none bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          {tab === "medicine" ? (
            <select
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm w-full lg:w-[260px]"
              value={medicineCategory}
              onChange={(e) => setMedicineCategory(e.target.value)}
            >
              {medicineCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <select
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm w-full lg:w-[320px]"
              value={equipmentCategory}
              onChange={(e) => setEquipmentCategory(e.target.value)}
            >
              {equipmentCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-blue-200">
        <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
          <h2 className="font-bold text-lg">
            {tab === "medicine" ? "Medicine Stock" : "Equipment Stock"}
          </h2>
          <span className="text-sm opacity-90">
            {tab === "medicine"
              ? `${filteredMedicines.length} items`
              : `${filteredEquipments.length} items`}
          </span>
        </div>

        <div className="overflow-x-auto">
          {tab === "medicine" ? (
            <table className="w-full text-left">
              <thead className="bg-blue-50 text-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Medicine</th>
                  <th className="p-4 font-semibold">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-blue-50/60">
                    <td className="p-4 font-medium text-slate-800">{m.name}</td>
                    <td className="p-4 text-slate-700">{m.qty}</td>
                  </tr>
                ))}
                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan="2" className="p-6 text-center text-slate-600 font-semibold">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-blue-50 text-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Equipment</th>
                  <th className="p-4 font-semibold">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-blue-50/60">
                    <td className="p-4 font-medium text-slate-800">{e.name}</td>
                    <td className="p-4 text-slate-700">{e.quantity}</td>
                  </tr>
                ))}
                {filteredEquipments.length === 0 && (
                  <tr>
                    <td colSpan="2" className="p-6 text-center text-slate-600 font-semibold">
                      No equipment found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-4 text-sm text-slate-600">
        Note: This page is read-only. Editing is restricted to authorized roles.
      </div>
    </div>
  );
};

export default InventoryReadOnly;
