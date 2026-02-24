import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaCheck, FaInbox } from "react-icons/fa";

const STORAGE_KEY = "store_inventory_requests";

function loadRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
function saveRequests(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default function InventoryRequests() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item: "", qty: 1, priority: "Normal" });

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  function openNew() {
    setForm({ item: "", qty: 1, priority: "Normal" });
    setShowForm(true);
  }

  function submitForm(e) {
    e.preventDefault();
    const req = { id: Date.now(), ...form, status: "open", createdAt: new Date().toISOString() };
    setRequests(r => [req, ...r]);
    setShowForm(false);
  }

  function cancelReq(id) {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: "cancelled" } : x));
  }

  function markFilled(id) {
    setRequests(r => r.map(x => x.id === id ? { ...x, status: "filled" } : x));
  }

  function remove(id) {
    if (!confirm("Delete request?")) return;
    setRequests(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaInbox className="text-blue-800 text-3xl" />
        <h1 className="text-2xl font-bold text-gray-800">Inventory Requests</h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Create and manage inventory requests to fulfill store needs.</div>
        <button onClick={openNew} className="bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2"><FaPlus /> New Request</button>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 && (
          <div className="bg-white p-6 rounded shadow text-gray-500">No requests yet. Create one using the button above.</div>
        )}

        {requests.map(r => (
          <div key={r.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.item}</div>
              <div className="text-xs text-gray-500">Qty: {r.qty} • Priority: {r.priority}</div>
              <div className="text-xs text-gray-400 mt-1">Created: {new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              {r.status === 'open' && (
                <>
                  <button onClick={() => markFilled(r.id)} className="px-3 py-1 bg-green-600 text-white rounded">Mark Filled</button>
                  <button onClick={() => cancelReq(r.id)} className="px-3 py-1 bg-yellow-400 text-white rounded">Cancel</button>
                </>
              )}

              {r.status === 'filled' && <span className="text-green-600 font-semibold">Filled</span>}
              {r.status === 'cancelled' && <span className="text-orange-600 font-semibold">Cancelled</span>}

              <button onClick={() => remove(r.id)} className="text-red-500 px-2 py-1"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={submitForm} className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">New Inventory Request</h3>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Item</label>
              <input required className="w-full border px-3 py-2 rounded" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Qty</label>
                <input required type="number" min={1} className="w-full border px-3 py-2 rounded" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: Number(e.target.value) }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select className="w-full border px-3 py-2 rounded" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
