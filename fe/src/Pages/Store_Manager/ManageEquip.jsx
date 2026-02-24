import React, { useState } from "react";

const categories = {
  "Diagnostic Tools": [
    "Thermometer",
    "Blood Pressure Monitor",
    "Glucometer",
    "Pulse Oximeter",
    "Stethoscope"
  ],
  "Emergency & First Aid Supplies": [
    "Bandages",
    "Gauze",
    "Gloves",
    "Cotton Rolls",
    "Masks",
    "Ice Packs",
    "Medical Tape"
  ],
  "Infection Control & Sterilization Supplies": [
    "Disinfectants",
    "Hand Sanitizers",
    "PPE Kits",
    "Isolation Gowns",
    "Surface Cleaners"
  ],
  "General Utility Supplies": [
    "Scissors",
    "Tweezers",
    "Kidney Tray",
    "Waste Bags",
    "Syringes",
    "Needles"
  ]
};

const categoryList = Object.keys(categories);

const EquipmentManagement = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    quantity: "",
    expiryDate: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // pagination: 1 category per page
  const [currentPage, setCurrentPage] = useState(0);

  const currentCategory = categoryList[currentPage];

  const isConsumable = (categoryName) =>
    categoryName === "Emergency & First Aid Supplies" ||
    categoryName === "Infection Control & Sterilization Supplies";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.id === null) {
      setEquipmentList([...equipmentList, { ...form, id: Date.now() }]);
    } else {
      setEquipmentList(
        equipmentList.map((item) => (item.id === form.id ? form : item))
      );
    }

    setShowForm(false);
    setForm({ id: null, name: "", category: "", quantity: "", expiryDate: "" });
  };

  const handleEdit = (item) => {
    setForm(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setEquipmentList(equipmentList.filter((item) => item.id !== id));
  };

  const filteredItems = equipmentList
    .filter((item) => item.category === currentCategory)
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        Hospital Equipment Management
      </h1>

      {/* Top Row */}
      <div className="flex justify-between mb-6">
        <button
          className="bg-blue-800 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Add Equipment
        </button>

        <input
          className="border px-4 py-2 rounded w-64"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white shadow p-6 rounded mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {form.id ? "Edit Equipment" : "Add Equipment"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Category</label>
              <select
                required
                className="border px-3 py-2 w-full rounded"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categoryList.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Equipment Name</label>
              <select
                required
                className="border px-3 py-2 w-full rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              >
                <option value="">Select Equipment</option>
                {form.category &&
                  categories[form.category].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="font-medium">Quantity</label>
              <input
                required
                type="number"
                className="border px-3 py-2 w-full rounded"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </div>

            {isConsumable(form.category) && (
              <div>
                <label className="font-medium">Expiry Date</label>
                <input
                  type="date"
                  className="border px-3 py-2 w-full rounded"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                />
              </div>
            )}

            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Title */}
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {currentCategory}
      </h2>

      {/* Table */}
      <table className="w-full border-collapse shadow-lg">
        <thead>
          <tr className="bg-blue-800 text-white">
            <th className="p-3 border">Equipment</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Expiry</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.length === 0 && (
            <tr>
              <td className="p-4 text-center border" colSpan={4}>
                No equipment found.
              </td>
            </tr>
          )}

          {filteredItems.map((item) => (
            <tr key={item.id} className="border text-center">
              <td className="p-3 border">{item.name}</td>
              <td className="p-3 border">{item.quantity}</td>
              <td className="p-3 border">
                {item.expiryDate ? item.expiryDate : "—"}
              </td>
              <td className="p-3 border flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <button
          disabled={currentPage === categoryList.length - 1}
          className="px-4 py-2 bg-blue-800 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EquipmentManagement;
