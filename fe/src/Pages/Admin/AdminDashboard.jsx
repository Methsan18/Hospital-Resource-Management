import React from "react";
import { HiUsers, HiClipboardList, HiOfficeBuilding, HiShieldCheck } from "react-icons/hi";

const stats = [
  {
    title: "Total Users",
    value: 28,
    icon: HiUsers,
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Pending Requests",
    value: 9,
    icon: HiClipboardList,
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    title: "Departments",
    value: 6,
    icon: HiOfficeBuilding,
    color: "bg-green-100 text-green-700"
  },
  {
    title: "System Roles",
    value: 10,
    icon: HiShieldCheck,
    color: "bg-purple-100 text-purple-700"
  }
];

const recentRequests = [
  { name: "Dr. Nimal Perera", role: "Doctor", department: "OPD" },
  { name: "Kavindi Silva", role: "Pharmacist", department: "Pharmacy" },
  { name: "Saman Jayasuriya", role: "Inventory Manager", department: "Stores" }
];

const AdminDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-blue-800 mb-8">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow flex items-center gap-4 ${item.color}`}
          >
            <item.icon className="text-4xl" />
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Registration Requests
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{req.role}</td>
                  <td className="p-3">{req.department}</td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            System Alerts
          </h2>

          <ul className="space-y-3 text-sm">
            <li className="bg-yellow-100 text-yellow-800 p-3 rounded">
              ⚠️ 9 pending registration requests awaiting review
            </li>
            <li className="bg-red-100 text-red-800 p-3 rounded">
              🚨 2 users inactive for over 90 days
            </li>
            <li className="bg-blue-100 text-blue-800 p-3 rounded">
              ℹ️ New role added: Seasonal Illness Analyst
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
