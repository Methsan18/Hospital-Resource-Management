import React, { useState } from "react";
import { FaSearch, FaEye, FaCheck, FaUser } from "react-icons/fa";

const samplePrescriptions = [
  {
    id: "RX-001",
    patient: "Mrs. Senanayake",
    items: [
      { name: "Paracetamol 500mg", qty: 10 },
      { name: "Amoxicillin 250mg", qty: 14 },
    ],
    date: "2026-01-02",
    status: "Pending",
    notes: "Give after food. Monitor blood sugar.",
  },
  {
    id: "RX-002",
    patient: "Mr. Perera",
    items: [{ name: "Insulin (Short) 10U", qty: 30 }],
    date: "2026-01-03",
    status: "Pending",
    notes: "Keep refrigerated. Patient taught dosing.",
  },
  {
    id: "RX-003",
    patient: "Miss. K.",
    items: [{ name: "Saline 500ml", qty: 2 }],
    date: "2026-01-03",
    status: "Dispensed",
    notes: "Given at ward B.",
  },
];

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState(samplePrescriptions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = prescriptions.filter((p) => {
    const matchSearch =
      p.patient.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.items.some((it) => it.name.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === "All" ? true : p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const open = (p) => setSelected(p);
  const close = () => setSelected(null);

  const markDispensed = (id) => {
    setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Dispensed" } : p)));
    if (selected && selected.id === id) setSelected({ ...selected, status: "Dispensed" });
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaUser className="text-blue-900 text-4xl" />
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Prescriptions</h1>
          <p className="text-sm text-gray-600">Review, dispense and track prescriptions</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center bg-white px-4 py-2 shadow rounded-md w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none"
            placeholder="Search by patient, id or medicine..."
          />
        </div>

        <select
          className="px-4 py-2 bg-white shadow rounded-md border border-gray-300"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Dispensed</option>
        </select>

        <div className="ml-auto text-sm text-gray-500">Total: <strong>{filtered.length}</strong></div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3">Prescription</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Items</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{p.id}</td>
                <td className="p-3">{p.patient}</td>
                <td className="p-3 text-sm text-gray-700">{p.items.map((i) => i.name).join(", ")}</td>
                <td className="p-3">{p.date}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${p.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-2">
                  <button className="text-sm px-3 py-1 bg-gray-100 rounded" onClick={() => open(p)} title="View">
                    <FaEye />
                  </button>

                  <button
                    className={`text-sm px-3 py-1 rounded ${p.status === "Dispensed" ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-800"}`}
                    onClick={() => markDispensed(p.id)}
                    disabled={p.status === "Dispensed"}
                  >
                    <FaCheck />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-600 p-6 font-semibold">No prescriptions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal / Drawer for prescription details */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Prescription</div>
                <div className="text-lg font-bold">{selected.id} — {selected.patient}</div>
                <div className="text-sm text-gray-500">Date: {selected.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${selected.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{selected.status}</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items</h3>
              <ul className="space-y-2 text-sm">
                {selected.items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>{it.name}</div>
                    <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Notes</h3>
              <div className="text-sm text-gray-700">{selected.notes}</div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={close}>Close</button>
              <button
                className={`px-4 py-2 rounded ${selected.status === "Dispensed" ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-800"}`}
                onClick={() => markDispensed(selected.id)}
                disabled={selected.status === "Dispensed"}
              >
                Mark as Dispensed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
