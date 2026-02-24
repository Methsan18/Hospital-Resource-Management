import React, { useEffect, useState } from "react";
import { FaBell, FaClipboardList, FaCheck, FaPlus } from "react-icons/fa";

const STORAGE_KEY = "store_alerts";
const REQ_KEY = "store_requirements";

function loadAlerts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || [
    { id: 1, type: "stock_out", item: "IV fluids", message: "Low stock (6 left)", from: "Pharmacist", resolved: false, createdAt: new Date().toISOString() },
    { id: 2, type: "expiry", item: "Amoxicillin 250mg", message: "Near expiry (2025-12-15)", from: "Pharmacist", resolved: false, createdAt: new Date().toISOString() }
  ];
}

function saveAlerts(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function loadReqs() {
  return JSON.parse(localStorage.getItem(REQ_KEY) || "[]");
}

function saveReqs(arr) {
  localStorage.setItem(REQ_KEY, JSON.stringify(arr));
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [creatingReqFor, setCreatingReqFor] = useState(null);
  const [reqQty, setReqQty] = useState(1);

  useEffect(() => {
    setAlerts(loadAlerts());
  }, []);

  useEffect(() => {
    saveAlerts(alerts);
  }, [alerts]);

  function markResolved(id) {
    setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x));
  }

  function createRequirementFromAlert(alert) {
    setCreatingReqFor(alert);
    setReqQty(10);
  }

  function submitReq() {
    if (!creatingReqFor) return;
    const reqs = loadReqs();
    const newReq = { id: Date.now(), item: creatingReqFor.item, qty: Number(reqQty), status: "open", createdAt: new Date().toISOString(), sourceAlertId: creatingReqFor.id };
    saveReqs([newReq, ...reqs]);
    // mark alert resolved
    setAlerts(a => a.map(x => x.id === creatingReqFor.id ? { ...x, resolved: true } : x));
    setCreatingReqFor(null);
  }

  function dismissCreate() {
    setCreatingReqFor(null);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-blue-800 text-3xl" />
        <h1 className="text-2xl font-bold text-gray-800">Alerts & Messages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><FaClipboardList /> Incoming Alerts</h2>

          <ul className="space-y-3">
            {alerts.map(a => (
              <li key={a.id} className={`p-3 rounded border ${a.resolved ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{a.item} <span className="text-xs text-gray-500">— {a.type}</span></div>
                    <div className="text-sm text-gray-600">{a.message}</div>
                    <div className="text-xs text-gray-400 mt-1">From: {a.from} • {new Date(a.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!a.resolved ? (
                      <>
                        <button onClick={() => createRequirementFromAlert(a)} className="bg-blue-800 text-white px-3 py-1 rounded text-sm flex items-center gap-2"><FaPlus /> Create Req</button>
                        <button onClick={() => markResolved(a.id)} className="text-sm px-3 py-1 rounded border">Mark Resolved</button>
                      </>
                    ) : (
                      <span className="text-green-600 flex items-center gap-2"><FaCheck /> Resolved</span>
                    )}
                  </div>
                </div>
              </li>
            ))}

            {alerts.length === 0 && <li className="text-gray-500">No alerts</li>}
          </ul>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Recent Requirements</h2>
          <ul className="space-y-2">
            {loadReqs().slice(0,6).map(r => (
              <li key={r.id} className="p-2 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.item}</div>
                  <div className="text-xs text-gray-500">Qty: {r.qty} • {r.status}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
            {loadReqs().length === 0 && <li className="text-gray-500">No requirements</li>}
          </ul>
        </div>
      </div>

      {/* Create Requirement Modal */}
      {creatingReqFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Create Requirement</h3>
            <div className="mb-3">Item: <strong>{creatingReqFor.item}</strong></div>
            <div className="mb-3">
              <label className="text-sm">Qty</label>
              <input type="number" min={1} value={reqQty} onChange={e => setReqQty(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={dismissCreate} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={submitReq} className="px-4 py-2 bg-blue-800 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
