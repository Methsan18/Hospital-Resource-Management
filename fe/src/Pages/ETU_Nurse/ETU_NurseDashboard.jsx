import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, Legend } from "recharts";
import {
  FaBed,
  FaProcedures,
  FaHospitalAlt,
  FaExclamationTriangle,
  FaChartLine,
  FaUserInjured
} from "react-icons/fa";

const occupancyTrend = [
  { date: "Mon", occupied: 268 },
  { date: "Tue", occupied: 275 },
  { date: "Wed", occupied: 289 },
  { date: "Thu", occupied: 300 },
  { date: "Fri", occupied: 309 },
  { date: "Sat", occupied: 315 },
  { date: "Sun", occupied: 306 },
];

const wardData = [
  { ward: "A", occupied: 80 },
  { ward: "B", occupied: 70 },
  { ward: "C", occupied: 65 },
  { ward: "D", occupied: 63 },
  { ward: "E", occupied: 50 },
];

const dischargeData = [
  { day: "Mon", discharges: 18 },
  { day: "Tue", discharges: 22 },
  { day: "Wed", discharges: 20 },
  { day: "Thu", discharges: 16 },
  { day: "Fri", discharges: 19 },
  { day: "Sat", discharges: 12 },
  { day: "Sun", discharges: 14 },
];

// Sample medicine & equipment alerts (for dashboard summaries)
const medicineAlerts = [
  { name: "IV Fluids", issue: "Low stock", qty: 6, severity: "warning" },
  { name: "Insulin", issue: "Near expiry", expiry: "2024-03-21", severity: "critical" },
];

const equipmentAlerts = [
  { name: "Gloves", issue: "Low stock", qty: 3, severity: "warning" },
  { name: "BP Monitor (Ward B)", issue: "Needs calibration", severity: "info" },
];

const operationalAlerts = [
  { category: "Beds", severity: "critical", message: "ICU beds are 95% occupied." },
  { category: "Medicine", severity: "warning", message: "Low stock of IV fluids may affect admissions." },
  { category: "Equipments", severity: "warning", message: "Gloves inventory low in ER." },
  { category: "Discharges", severity: "info", message: "18 patient discharges expected today." },
];

// Simple custom tooltip for clarity
const SimpleTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const name = item.name || item.dataKey || '';
  const isDischarge = name.toLowerCase().includes('discharg');
  const suffix = isDischarge ? ' discharges' : ' beds';
  return (
    <div className="bg-white p-2 rounded shadow-sm text-sm border">
      <div className="font-semibold mb-1">{label}</div>
      <div>
        <span style={{ color: item.color, fontWeight: 700 }}>{item.name}:</span> {item.value}{suffix}
      </div>
    </div>
  );
};

const ETU_NurseDashboard = () => { 
  const severityRank = { critical: 3, warning: 2, info: 1 };
  const sortedAlerts = operationalAlerts.slice().sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 mt-1">

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Hospital Bed Management Dashboard
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Resource Summary (refactored into 3 tidy cards) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Beds</p>
              <h3 className="text-lg font-bold">{occupancyTrend[occupancyTrend.length - 1].occupied} occupied</h3>
              <p className="text-xs text-gray-500">Available: {320 - occupancyTrend[occupancyTrend.length - 1].occupied}</p>
            </div>
            <FaProcedures className="text-red-500 text-2xl" />
          </div>
          <div className="mt-3">
            <button className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded">View bed details</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medicine Alerts</p>
              <h3 className="text-lg font-bold">{medicineAlerts.length} issues</h3>
              <p className="text-xs text-gray-500">Critical & low-stock items</p>
            </div>
            <FaHospitalAlt className="text-yellow-500 text-2xl" />
          </div>
          <div className="mt-3">
            <button className="text-xs px-3 py-1 bg-yellow-50 text-yellow-700 rounded">Review medicines</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Equipment Alerts</p>
              <h3 className="text-lg font-bold">{equipmentAlerts.length} items</h3>
              <p className="text-xs text-gray-500">Maintenance & low-stock</p>
            </div>
            <FaBed className="text-blue-500 text-2xl" />
          </div>
          <div className="mt-3">
            <button className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded">Review equipment</button>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

        {/* Occupancy Trend */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Bed Occupancy Trend</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Legend verticalAlign="top" height={24} />
                <Tooltip content={<SimpleTooltip />} />
                <Line type="monotone" dataKey="occupied" name="Occupied" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> 

        {/* Ward-wise Occupancy */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Ward-wise Occupancy</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ward" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Legend verticalAlign="top" height={24} />
                <Tooltip content={<SimpleTooltip />} />
                <Bar dataKey="occupied" name="Occupied" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> 

        {/* Expected Discharges */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Expected Discharges</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dischargeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Legend verticalAlign="top" height={24} />
                <Tooltip content={<SimpleTooltip />} />
                <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#16a34a" fill="#bbf7d0" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div> 

      </div>

      {/* Operational Alerts Panel (refined layout) */}
      <div className="bg-white shadow-md rounded-xl p-6 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Operational Alerts & Notices</h2>
          <div className="text-sm text-gray-500">Updated just now</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Alerts list (sorted, clear badges) */}
          <div className="space-y-3">
            {sortedAlerts.map((a, idx) => {
              const leftBorder =
                a.severity === "critical"
                  ? "border-l-4 border-red-500"
                  : a.severity === "warning"
                  ? "border-l-4 border-yellow-400"
                  : "border-l-4 border-blue-400";

              const badge =
                a.severity === "critical"
                  ? "bg-red-100 text-red-700"
                  : a.severity === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800";

              return (
                <div key={idx} className={`${leftBorder} bg-white p-3 rounded-lg shadow-sm flex items-start justify-between`}>
                  <div className="flex gap-3 items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <div className="font-semibold">{a.category}</div>
                      <div className="text-sm text-gray-700">{a.message}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${badge}`}>{a.severity.toUpperCase()}</span>
                    <button className="text-xs px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">Acknowledge</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Details columns (tidy lists and small CTAs) */}
          <div className="grid grid-cols-1 gap-4">

            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Medicine Issues</div>
                <button className="text-xs px-2 py-1 bg-blue-900 text-white rounded">Create Orders</button>
              </div>

              <ul className="text-sm text-gray-700 space-y-2">
                {medicineAlerts.map((m) => (
                  <li key={m.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.issue}{m.qty ? ` — ${m.qty} left` : ''}{m.expiry ? ` — expiry ${m.expiry}` : ''}</div>
                    </div>
                    <button className="text-xs px-2 py-1 bg-blue-900 text-white rounded">Order</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">Equipment Issues</div>
                <button className="text-xs px-2 py-1 bg-blue-900 text-white rounded">Request</button>
              </div>

              <ul className="text-sm text-gray-700 space-y-2">
                {equipmentAlerts.map((e) => (
                  <li key={e.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-gray-500">{e.issue}{e.qty ? ` — ${e.qty} left` : ''}</div>
                    </div>
                    <button className="text-xs px-2 py-1 bg-blue-900 text-white rounded">Request</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ETU_NurseDashboard;
