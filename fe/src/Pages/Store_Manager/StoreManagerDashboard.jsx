import React, { useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaPills,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaCheckCircle
} from "react-icons/fa";

const StoreManagerDashboard = () => {
  // Sample data
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol 500mg", qty: 120, expiry: "2026-08-01" },
    { id: 2, name: "Amoxicillin 250mg", qty: 18, expiry: "2025-12-15" },
    { id: 3, name: "IV fluids", qty: 6, expiry: "2026-02-10" },
  ]);

  const [equipment, setEquipment] = useState([
    { id: 1, name: "ECG Machine", qty: 4, status: "Good" },
    { id: 2, name: "Infusion Pump", qty: 2, status: "Service due" },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: "stock_out", item: "IV fluids", message: "Stock low (6 left)", from: "Pharmacist", resolved: false },
    { id: 2, type: "expiry", item: "Amoxicillin 250mg", message: "Near expiry (2025-12-15)", from: "Pharmacist", resolved: false },
  ]);

  const [requirements, setRequirements] = useState([]);

  // Modals / forms
  const [showMedModal, setShowMedModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const [showEquipModal, setShowEquipModal] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);

  const [showReqModal, setShowReqModal] = useState(false);
  const [reqFromAlert, setReqFromAlert] = useState(null);

  // Derived counts
  const counts = useMemo(() => ({
    medicines: medicines.length,
    equipment: equipment.length,
    pendingAlerts: alerts.filter(a => !a.resolved).length,
    pendingRequirements: requirements.filter(r => r.status === "open").length,
  }), [medicines, equipment, alerts, requirements]);

  // Handlers
  function openAddMed() {
    setEditingMed(null);
    setShowMedModal(true);
  }
  function saveMed(form) {
    if (editingMed) {
      setMedicines(meds => meds.map(m => m.id === editingMed.id ? { ...m, ...form } : m));
    } else {
      setMedicines(meds => [{ id: Date.now(), ...form }, ...meds]);
    }
    setShowMedModal(false);
  }
  function removeMed(id) {
    setMedicines(meds => meds.filter(m => m.id !== id));
  }

  function openAddEquip() {
    setEditingEquip(null);
    setShowEquipModal(true);
  }
  function saveEquip(form) {
    if (editingEquip) {
      setEquipment(eq => eq.map(e => e.id === editingEquip.id ? { ...e, ...form } : e));
    } else {
      setEquipment(eq => [{ id: Date.now(), ...form }, ...eq]);
    }
    setShowEquipModal(false);
  }
  function removeEquip(id) {
    setEquipment(eq => eq.filter(e => e.id !== id));
  }

  function createRequirementFromAlert(alert) {
    const req = { id: Date.now(), item: alert.item, qty: 0, status: "open", createdAt: new Date().toISOString(), sourceAlertId: alert.id };
    setRequirements(rs => [req, ...rs]);
    // mark alert as resolved once requirement created
    setAlerts(a => a.map(x => x.id === alert.id ? { ...x, resolved: true } : x));
  }

  function markAlertResolved(id) {
    setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x));
  }

  function fillRequirement(id, qty) {
    setRequirements(rs => rs.map(r => r.id === id ? { ...r, qty, status: "filled" } : r));
  }

  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 mt-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Store Manager Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button onClick={openAddMed} className="bg-blue-900 text-white px-4 py-2 rounded flex items-center space-x-2"><FaPills /> <span>Add Medicine</span></button>
          <button onClick={openAddEquip} className="bg-blue-900 text-white px-4 py-2 rounded flex items-center space-x-2"><FaBoxOpen /> <span>Add Equipment</span></button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Medicines</p>
              <h3 className="text-2xl font-bold text-blue-900">{counts.medicines}</h3>
            </div>
            <FaPills className="text-blue-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Equipment</p>
              <h3 className="text-2xl font-bold text-blue-900">{counts.equipment}</h3>
            </div>
            <FaBoxOpen className="text-indigo-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Pending Alerts</p>
              <h3 className="text-2xl font-bold text-blue-900">{counts.pendingAlerts}</h3>
            </div>
            <FaExclamationTriangle className="text-yellow-600 text-3xl" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Requirements</p>
              <h3 className="text-2xl font-bold text-blue-900">{counts.pendingRequirements}</h3>
            </div>
            <FaClipboardList className="text-green-600 text-3xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* Alerts */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Pharmacist Alerts</h2>
          <ul className="space-y-3">
            {alerts.map(a => (
              <li key={a.id} className={`p-3 rounded-lg border ${a.resolved ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{a.item} <span className="text-gray-500 text-xs">— {a.from}</span></p>
                    <p className="text-sm text-gray-600">{a.message}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {!a.resolved && (
                      <>
                        <button onClick={() => createRequirementFromAlert(a)} className="text-sm bg-blue-900 text-white px-3 py-1 rounded">Create Req</button>
                        <button onClick={() => markAlertResolved(a.id)} className="text-sm text-gray-700 px-3 py-1 rounded border">Mark Resolved</button>
                      </>
                    )}
                    {a.resolved && <span className="text-green-600 flex items-center gap-2"><FaCheckCircle /> Resolved</span>}
                  </div>
                </div>
              </li>
            ))}
            {alerts.length === 0 && <li className="text-gray-500">No alerts</li>}
          </ul>
        </div>

        {/* Requirements */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <div className="space-y-3">
            {requirements.map(r => (
              <div key={r.id} className="p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.item}</p>
                  <p className="text-xs text-gray-500">Created: {new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {r.status === 'open' ? (
                    <button onClick={() => fillRequirement(r.id, 10)} className="bg-blue-900 text-white px-3 py-1 rounded">Fill 10</button>
                  ) : (
                    <span className="text-green-600">Filled</span>
                  )}
                </div>
              </div>
            ))}
            {requirements.length === 0 && <div className="text-gray-500">No requirements</div>}
          </div>
        </div>

        {/* Stock Overview / Charts */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Stock Overview</h2>
          <div className="space-y-4">
            <div className="h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Small Line Chart Placeholder</div>
            <div className="h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">Bar Chart Placeholder</div>
          </div>
        </div>

      </div>

      {/* Medicines & Equipment Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Medicines</h3>
            <div className="text-sm text-gray-500">Total: {medicines.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Expiry</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m.id} className="border-t">
                    <td className="py-3">{m.name}</td>
                    <td className="py-3">{m.qty}</td>
                    <td className="py-3">{m.expiry}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingMed(m); setShowMedModal(true); }} className="text-blue-900 bg-blue-100 px-2 py-1 rounded flex items-center gap-2"><FaEdit /> Edit</button>
                        <button onClick={() => removeMed(m.id)} className="text-red-600 bg-red-100 px-2 py-1 rounded flex items-center gap-2"><FaTrash /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Equipment</h3>
            <div className="text-sm text-gray-500">Total: {equipment.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(e => (
                  <tr key={e.id} className="border-t">
                    <td className="py-3">{e.name}</td>
                    <td className="py-3">{e.qty}</td>
                    <td className="py-3">{e.status}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingEquip(e); setShowEquipModal(true); }} className="text-blue-900 bg-blue-100 px-2 py-1 rounded flex items-center gap-2"><FaEdit /> Edit</button>
                        <button onClick={() => removeEquip(e.id)} className="text-red-600 bg-red-100 px-2 py-1 rounded flex items-center gap-2"><FaTrash /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
      {showMedModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingMed ? 'Edit' : 'Add'} Medicine</h3>
            <form onSubmit={(e) => { e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target)); saveMed({ name: fd.name, qty: Number(fd.qty), expiry: fd.expiry }); }}>
              <div className="space-y-3">
                <input name="name" defaultValue={editingMed?.name || ''} required placeholder="Medicine name" className="w-full p-2 border rounded" />
                <input name="qty" defaultValue={editingMed?.qty || 0} required type="number" placeholder="Quantity" className="w-full p-2 border rounded" />
                <input name="expiry" defaultValue={editingMed?.expiry || ''} required type="date" className="w-full p-2 border rounded" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowMedModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEquipModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingEquip ? 'Edit' : 'Add'} Equipment</h3>
            <form onSubmit={(e) => { e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target)); saveEquip({ name: fd.name, qty: Number(fd.qty), status: fd.status }); }}>
              <div className="space-y-3">
                <input name="name" defaultValue={editingEquip?.name || ''} required placeholder="Equipment name" className="w-full p-2 border rounded" />
                <input name="qty" defaultValue={editingEquip?.qty || 0} required type="number" placeholder="Quantity" className="w-full p-2 border rounded" />
                <input name="status" defaultValue={editingEquip?.status || 'Good'} placeholder="Status" className="w-full p-2 border rounded" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowEquipModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoreManagerDashboard;
