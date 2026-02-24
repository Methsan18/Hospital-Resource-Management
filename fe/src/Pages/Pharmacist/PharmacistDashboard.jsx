import React from "react";
import { FaPills, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PharmacistDashboard = () => {
  const demandData = [
    { name: "Paracetamol", demand: 420 },
    { name: "Amoxicillin", demand: 180 },
    { name: "Insulin", demand: 125 },
    { name: "Saline", demand: 90 },
  ];

  const lowStockItems = [
    { name: "IV Fluids", qty: 6 },
    { name: "Gloves", qty: 3 },
    { name: "Insulin", qty: 5 },
  ];

  const combinedAlerts = [
    {
      type: "medicine",
      message: "Paracetamol stock will run out in 7 days.",
      severity: "critical",
    },
    {
      type: "equipment",
      message: "Gloves low in ER (3 left).",
      severity: "warning",
    },
    {
      type: "medicine",
      message: "5 medicines are below reorder level.",
      severity: "warning",
    },
  ];

  const severityBadge = (severity) => {
    if (severity === "critical")
      return "bg-red-100 text-red-700 border border-red-200";
    if (severity === "warning")
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    return "bg-blue-100 text-blue-800 border border-blue-200";
  };

  const severityDot = (severity) => {
    if (severity === "critical") return "bg-red-500";
    if (severity === "warning") return "bg-yellow-400";
    return "bg-blue-400";
  };

  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 lg:p-10 mt-1">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Pharmacist Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">
          Overview of prescriptions, dispensing workload, and stock-related alerts.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white shadow-md rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <FaClipboardList className="text-green-700 text-2xl" />
            </div>
            <div>
              <p className="text-slate-600 font-semibold text-sm">Prescriptions Today</p>
              <h3 className="text-2xl font-bold text-slate-900">42</h3>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            Updated
          </span>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaPills className="text-blue-700 text-2xl" />
            </div>
            <div>
              <p className="text-slate-600 font-semibold text-sm">Pending Dispense</p>
              <h3 className="text-2xl font-bold text-slate-900">8</h3>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            In queue
          </span>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-700 text-2xl" />
            </div>
            <div>
              <p className="text-slate-600 font-semibold text-sm">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-slate-900">5</h3>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
            Action needed
          </span>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-5 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
              <FaPills className="text-yellow-700 text-2xl" />
            </div>
            <div>
              <p className="text-slate-600 font-semibold text-sm">Requests Sent</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            Pending
          </span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Low stock list */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Low Stock Items</h2>
          <p className="text-sm text-slate-600 mb-4">
            Items that need attention soon.
          </p>

          <div className="space-y-3">
            {lowStockItems.map((i) => (
              <div
                key={i.name}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
              >
                <div className="font-semibold text-slate-800">{i.name}</div>
                <div className="text-red-700 font-bold">{i.qty} left</div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand chart */}
        <div className="xl:col-span-2 bg-white shadow-md rounded-2xl p-6 border border-slate-100">
          <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Medicine Demand Snapshot</h2>
              <p className="text-sm text-slate-600">
                Recent demand trend to support restocking decisions.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Last 7 days (sample)
            </span>
          </div>

          <div className="h-72 bg-gradient-to-b from-blue-50 to-white border border-slate-200 rounded-2xl p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="demand" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Tip: If an item is predicted to stock-out, submit an inventory request to the store manager.
          </p>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-8 border border-slate-100">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Alerts</h2>
            <p className="text-sm text-slate-600">
              Combined alerts for medicines and consumable equipment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {combinedAlerts.map((a, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-start"
            >
              <div className={`w-2.5 h-10 rounded-full ${severityDot(a.severity)}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${severityBadge(a.severity)}`}>
                    {a.severity === "critical" ? "Critical" : a.severity === "warning" ? "Warning" : "Info"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {a.type === "medicine" ? "Medicine" : "Equipment"}
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
