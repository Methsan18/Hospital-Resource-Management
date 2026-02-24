import React, { useState } from "react";
import { FaSearch, FaBoxOpen, FaCheck, FaTimes } from "react-icons/fa";

const sampleQueue = [
  {
    id: "RX-101",
    patient: "Mrs. Silva",
    items: [
      { name: "Paracetamol 500mg", required: 10, available: 120 },
      { name: "Amoxicillin 250mg", required: 14, available: 18 },
    ],
    prescribedBy: "Dr. Fernando",
    date: "2026-01-03",
    notes: "Take after meals",
    status: "Pending",
  },
  {
    id: "RX-102",
    patient: "Mr. Jayasuriya",
    items: [{ name: "Insulin 10U", required: 30, available: 5 }],
    prescribedBy: "Dr. Kumara",
    date: "2026-01-04",
    notes: "Keep refrigerated",
    status: "Pending",
  },
];

const Dispense = () => {
  const [queue, setQueue] = useState(sampleQueue);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [note, setNote] = useState("");

  const filtered = queue.filter((q) => {
    return (
      q.patient.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openDispense = (p) => {
    setSelected(p);
    // initialize adjustments with required quantities
    const init = {};
    p.items.forEach((it, idx) => {
      init[idx] = Math.min(it.required, it.available);
    });
    setAdjustments(init);
    setNote("");
  };

  const close = () => {
    setSelected(null);
    setAdjustments({});
    setNote("");
  };

  const confirmDispense = (id) => {
    // mark as dispensed and (simulated) reduce available counts locally
    setQueue((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newItems = p.items.map((it, idx) => {
          const dispensed = adjustments[idx] ?? it.required;
          return { ...it, available: it.available - dispensed };
        });
        return { ...p, status: "Dispensed", items: newItems, note: note };
      })
    );
    close();
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaBoxOpen className="text-blue-900 text-4xl" />
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Dispense Medicines</h1>
          <p className="text-sm text-gray-600">Process prescriptions and update dispense status</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center bg-white px-4 py-2 shadow rounded-md w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input placeholder="Search by patient or prescription id..." className="w-full focus:outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="ml-auto text-sm text-gray-500">Queue: <strong>{filtered.length}</strong></div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3">Prescription</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Prescribed By</th>
              <th className="p-3">Items (required)</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3">{p.patient}</td>
                <td className="p-3">{p.prescribedBy}</td>
                <td className="p-3 text-sm text-gray-700">{p.items.map((i) => `${i.name} (${i.required})`).join(', ')}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${p.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{p.status}</span>
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button className="text-sm px-3 py-1 bg-gray-100 rounded" onClick={() => openDispense(p)}>View</button>
                  <button
                    className={`text-sm px-3 py-1 rounded ${p.status === 'Dispensed' ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-blue-800'}`}
                    onClick={() => openDispense(p)}
                    disabled={p.status === 'Dispensed'}
                  >
                    Dispense
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-600 p-6 font-semibold">No prescriptions in queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dispense Drawer / Modal */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Dispense — {selected.id}</div>
                <div className="text-lg font-bold">{selected.patient}</div>
                <div className="text-sm text-gray-500">Prescribed by: {selected.prescribedBy} • {selected.date}</div>
              </div>
              <button className="text-gray-500" onClick={close}><FaTimes /></button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items to dispense</h3>
              <div className="space-y-2">
                {selected.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-500">Available: {it.available}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={it.available}
                        value={adjustments[idx] ?? it.required}
                        onChange={(e) => setAdjustments((s) => ({ ...s, [idx]: Math.max(0, Math.min(it.available, Number(e.target.value) || 0)) }))}
                        className="w-20 px-2 py-1 border rounded"
                        title="Quantity to dispense"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Notes (optional)</h3>
              <textarea className="w-full border p-2 rounded" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={close}>Cancel</button>
              <button className="px-4 py-2 bg-blue-900 text-white rounded" onClick={() => confirmDispense(selected.id)}>
                <FaCheck className="inline mr-2" /> Confirm Dispense
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dispense;
