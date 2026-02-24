import React from "react";
import {
  FaBed,
  FaProcedures,
  FaHospitalAlt,
  FaExclamationTriangle,
  FaChartLine,
  FaUserInjured
} from "react-icons/fa";

const OPD_DocDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 mt-20">

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Hospital Bed Management Dashboard
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Beds */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500">
          <div className="flex items-center space-x-4">
            <FaBed className="text-blue-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Total Beds</p>
              <h3 className="text-2xl font-bold">320</h3>
            </div>
          </div>
        </div>

        {/* Occupied Beds */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-red-500">
          <div className="flex items-center space-x-4">
            <FaProcedures className="text-red-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Occupied Beds</p>
              <h3 className="text-2xl font-bold">278</h3>
            </div>
          </div>
        </div>

        {/* Available Beds */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center space-x-4">
            <FaHospitalAlt className="text-green-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Available Beds</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-yellow-500">
          <div className="flex items-center space-x-4">
            <FaExclamationTriangle className="text-yellow-600 text-3xl" />
            <div>
              <p className="text-gray-600 font-semibold">Critical Alerts</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

        {/* Occupancy Trend */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Bed Occupancy Trend</h2>
          <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Line Chart Placeholder
          </div>
        </div>

        {/* Ward-wise Occupancy */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Ward-wise Occupancy</h2>
          <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Bar Chart Placeholder
          </div>
        </div>

        {/* Expected Discharges */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">Expected Discharges</h2>
          <div className="h-56 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Forecast Chart Placeholder
          </div>
        </div>

      </div>

      {/* Alerts Panel */}
      <div className="bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>

        <ul className="space-y-3">

          <li className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-300">
            🚨 ICU beds are <strong>95% occupied</strong>.
          </li>

          <li className="bg-yellow-100 text-yellow-800 p-3 rounded-lg border border-yellow-300">
            ⚠ Emergency ward expected surge due to <strong>road accidents</strong>.
          </li>

          <li className="bg-blue-100 text-blue-800 p-3 rounded-lg border border-blue-300">
            ℹ 18 patient discharges expected today.
          </li>

          {/* Medicine-linked alert */}
          <li className="bg-orange-100 text-orange-800 p-3 rounded-lg border border-orange-300">
            ⚠ Low stock of <strong>IV fluids</strong> may affect bed admissions.
          </li>

        </ul>
      </div>

    </div>
  );
};

export default OPD_DocDashboard;
