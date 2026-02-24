import React, { useState } from "react";
import { FaSearch, FaBox, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const sampleEquipment = [
  { id: 1, name: "Gloves (Medium)", category: "Consumables", qty: 3, expiry: "2025-05-15", location: "ER" },
  { id: 2, name: "Gauze", category: "Consumables", qty: 6, expiry: "2026-02-01", location: "Stock Room" },
  { id: 3, name: "Thermometer", category: "Diagnostic", qty: 12, expiry: "—", location: "OPD" },
  { id: 4, name: "BP Monitor", category: "Diagnostic", qty: 2, expiry: "—", location: "Ward B" },
  { id: 5, name: "Syringes", category: "Consumables", qty: 25, expiry: "2027-09-01", location: "Stock Room" },
];

const categoryList = ["All", "Consumables", "Diagnostic", "Sterilization", "General"];

const EquipmentInventory = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [requestedIds, setRequestedIds] = useState([]);
  const [orderedIds, setOrderedIds] = useState([]);

  const isLow = (qty, categoryName) => {
    const threshold = categoryName === "Consumables" ? 10 : 3;
    return qty <= threshold;
  };

  const filtered = sampleEquipment
    .filter((e) => (category === "All" ? true : e.category === category))
    .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.location.toLowerCase().includes(query.toLowerCase()));

  const sendRequest = (item) => {
    if (!isLow(item.qty, item.category)) return;
    setRequestedIds((s) => (s.includes(item.id) ? s : [...s, item.id]));
  };

  const createOrder = (item) => {
    setOrderedIds((s) => (s.includes(item.id) ? s : [...s, item.id]));
  };

  const lowCount = sampleEquipment.filter((e) => isLow(e.qty, e.category)).length;

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaBox className="text-blue-900 text-4xl" />
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Equipment Inventory (Pharmacist)</h1>
          <p className="text-sm text-gray-600">Monitor consumables and equipment across OPD & ETU — request or order as needed</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center bg-white px-4 py-2 shadow rounded-md w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input placeholder="Search equipment or location..." className="w-full focus:outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <select className="px-4 py-2 bg-white shadow rounded-md border border-gray-300" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryList.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-700">Low stock: <span className="font-semibold text-red-600">{lowCount}</span></div>
          <button className="text-sm px-3 py-2 bg-blue-900 text-white rounded">Export</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3">Equipment</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const low = isLow(item.qty, item.category);
              const requested = requestedIds.includes(item.id);
              const ordered = orderedIds.includes(item.id);

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.category}</td>
                  <td className={`p-3 ${low ? 'text-red-600 font-semibold' : ''}`}>{item.qty}</td>
                  <td className="p-3">{item.expiry}</td>
                  <td className="p-3">{item.location}</td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button
                      className={`text-sm px-3 py-1 rounded ${requested ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : low ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      onClick={() => sendRequest(item)}
                      disabled={!low || requested}
                      title={requested ? 'Request sent' : low ? 'Send request to store' : 'Stock sufficient — no request needed'}
                    >
                      {requested ? 'Requested' : 'Request'}
                    </button>

                    <button
                      className={`text-sm px-3 py-1 rounded ${ordered ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                      onClick={() => createOrder(item)}
                      disabled={ordered}
                    >
                      {ordered ? 'Ordered' : 'Create Order'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-600 p-6 font-semibold">No equipment found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Quick actions</h3>
          <p className="text-sm text-gray-600 mb-3">Create a single order or send requests for low-stock items.</p>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-blue-900 text-white rounded">Open Inventory Requests</button>
            <button className="px-3 py-2 bg-gray-100 rounded">View Request History</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Alerts</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {sampleEquipment.filter((e)=>isLow(e.qty,e.category)).map((e)=> (
              <div key={e.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded">
                <div className="w-2 h-6 rounded bg-red-500"></div>
                <div className="flex-1">{e.name} low ({e.qty} left) — {e.location}</div>
                <div className="text-sm text-red-600 font-semibold">Action needed</div>
              </div>
            ))}

            {sampleEquipment.filter((e)=>!isLow(e.qty,e.category)).length === sampleEquipment.length && (
              <div className="text-sm text-gray-500">No urgent equipment alerts</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentInventory;