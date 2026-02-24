import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from "recharts";
import { FaChartLine, FaFileExport } from "react-icons/fa";

const usageData = [
  { date: "Jan 1", paracetamol: 40, amoxicillin: 18, insulin: 10 },
  { date: "Jan 2", paracetamol: 50, amoxicillin: 12, insulin: 8 },
  { date: "Jan 3", paracetamol: 36, amoxicillin: 22, insulin: 15 },
  { date: "Jan 4", paracetamol: 60, amoxicillin: 30, insulin: 20 },
  { date: "Jan 5", paracetamol: 48, amoxicillin: 15, insulin: 12 },
  { date: "Jan 6", paracetamol: 55, amoxicillin: 18, insulin: 9 },
];

const forecast = [
  { name: "Paracetamol", expected: 420 },
  { name: "Amoxicillin", expected: 180 },
  { name: "Insulin", expected: 110 },
  { name: "Saline", expected: 95 },
];

const recommendations = [
  { name: "Paracetamol", reason: "High usage trend — reorder sooner", suggestion: "Order 1000 tabs" },
  { name: "Insulin", reason: "Low on hand and rising demand", suggestion: "Order 200 units" },
];

const Analytics = () => {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaChartLine className="text-blue-900 text-4xl" />
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Medicine Analytics</h1>
          <p className="text-sm text-gray-600">Usage trends, demand forecast and reorder recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Usage Trends (7d)</h2>
            <button className="text-sm px-3 py-1 bg-gray-100 rounded flex items-center gap-2"><FaFileExport /> Export</button>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="paracetamol" stroke="#2563eb" name="Paracetamol" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="amoxicillin" stroke="#7c3aed" name="Amoxicillin" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="insulin" stroke="#ef4444" name="Insulin" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-3">Demand Forecast</h3>
          <div className="h-36 mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expected" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
          <ul className="space-y-2 text-sm">
            {recommendations.map((r) => (
              <li key={r.name} className="bg-gray-50 p-2 rounded border flex items-start justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-600">{r.reason}</div>
                </div>
                <div className="text-sm text-blue-900 font-semibold">{r.suggestion}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-sm font-semibold mb-3">Top movers (by usage)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Paracetamol</div>
            <div className="text-lg font-bold">420</div>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Amoxicillin</div>
            <div className="text-lg font-bold">180</div>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Insulin</div>
            <div className="text-lg font-bold">110</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
