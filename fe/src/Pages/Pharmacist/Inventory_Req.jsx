import React, { useState } from "react";
import { FaPlus, FaTimes, FaInbox } from "react-icons/fa";

const sampleCatalog = [
  "Paracetamol 500mg",
  "Amoxicillin 250mg",
  "Insulin 10U",
  "Saline 500ml",
  "Gloves (Medium)",
  "Gauze",
];

const InventoryRequest = () => {
  const [requests, setRequests] = useState([]);
  const [item, setItem] = useState(sampleCatalog[0]);
  const [qty, setQty] = useState(1);
  const [priority, setPriority] = useState("Normal");
  const [notes, setNotes] = useState("");

  const submitRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-5)}`,
      item,
      qty: Number(qty),
      priority,
      notes,
      status: "Pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRequests((r) => [newReq, ...r]);
    // reset
    setQty(1);
    setPriority("Normal");
    setNotes("");
  };

  const cancelRequest = (id) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r)));
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaInbox className="text-blue-900 text-4xl" />
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Inventory Requests</h1>
          <p className="text-sm text-gray-600">Create and track inventory requests to the Store Manager</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">New Request</h2>
          <form onSubmit={submitRequest} className="space-y-3">
            <div className="flex gap-3">
              <select value={item} onChange={(e) => setItem(e.target.value)} className="flex-1 px-3 py-2 border rounded">
                {sampleCatalog.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} className="w-28 px-3 py-2 border rounded" />

              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-40 px-3 py-2 border rounded">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Critical</option>
              </select>
            </div>

            <div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Additional notes (optional)"></textarea>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-900 text-white rounded flex items-center gap-2" type="submit">
                <FaPlus /> Create Request
              </button>
              <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={() => { setQty(1); setNotes(""); setPriority("Normal"); }}>Reset</button>
            </div>
          </form>
        </div>

        {/* Recent requests */}
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Requests</h3>
          <div className="space-y-3">
            {requests.length === 0 && <div className="text-sm text-gray-500">No requests yet.</div>}
            {requests.map((r) => (
              <div key={r.id} className="p-3 border rounded flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium">{r.item} <span className="text-xs text-gray-500">x{r.qty}</span></div>
                  <div className="text-xs text-gray-500">{r.createdAt} • {r.priority}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className={`text-xs px-2 py-0.5 rounded ${r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : r.status === 'Cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'}`}>{r.status}</div>
                  <div className="flex gap-2">
                    {r.status === 'Pending' && <button className="text-xs px-2 py-1 bg-gray-100 rounded" onClick={() => cancelRequest(r.id)}>Cancel</button>}
                    <button className="text-xs px-2 py-1 bg-blue-900 text-white rounded">View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History / placeholder for requests table */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Request History</h3>
        <div className="text-sm text-gray-500">A complete history and status tracking will appear here (server-backed).</div>
      </div>
    </div>
  );
};

export default InventoryRequest;
