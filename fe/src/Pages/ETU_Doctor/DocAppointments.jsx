import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from "recharts";

const Appointments = () => {
  const [appointments] = useState([
    {
      id: 1,
      doctor: "Dr. Samantha Perera",
      specialization: "Cardiologist",
      hospital: "Lanka Hospitals",
      date: "2026-01-05",
      time: "10:30 AM",
      patient: "Chamika Adikari",
      status: "Confirmed",
      reason: "Chest pain consultation",
    },
    {
      id: 2,
      doctor: "Dr. Nuwan Jayasinghe",
      specialization: "Dermatologist",
      hospital: "Asiri Medical Hospital",
      date: "2026-01-07",
      time: "02:00 PM",
      patient: "Chamika Adikari",
      status: "Pending",
      reason: "Skin allergy check",
    },
    {
      id: 3,
      doctor: "Dr. Malith Fernando",
      specialization: "Orthopedic",
      hospital: "Durdans Hospital",
      date: "2026-01-08",
      time: "11:00 AM",
      patient: "Chamika Adikari",
      status: "Confirmed",
      reason: "Knee pain",
    },
  ]);

  // Summary data
  const statusSummary = [
    { name: "Confirmed", value: appointments.filter(a => a.status === "Confirmed").length },
    { name: "Pending", value: appointments.filter(a => a.status === "Pending").length },
    { name: "Cancelled", value: appointments.filter(a => a.status === "Cancelled").length },
  ];

  const doctorSummary = appointments.reduce((acc, curr) => {
    acc[curr.doctor] = (acc[curr.doctor] || 0) + 1;
    return acc;
  }, {});

  const doctorData = Object.entries(doctorSummary).map(([doctor, count]) => ({
    doctor,
    count
  }));

  const COLORS = ["#4ade80", "#facc15", "#f87171"]; // Green, Yellow, Red

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-6 fixed h-full shadow-lg">
          <h2 className="text-2xl font-bold mb-20">Doctor Panel</h2>
          <ul className="space-y-4">
            <li>
              <Link
                to="/doctor-availability"
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors text-lg"
              >
                Doctor Availability
              </Link>
            </li>
            <li>
              <Link
                to="/appointments"
                className="block py-2 px-4 rounded bg-gray-700 text-lg"
              >
                Appointments
              </Link>
            </li>
            <li>
              <Link
                to="/doctor/1"  // Example link to doctor profile page
                className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors text-lg"
              >
                Doctor Profile
              </Link>
            </li>
          </ul>
        </div>

        

        {/* Main Content */}
        <div className="ml-64 flex-1 pt-10 px-6">
          <h1 className="text-3xl font-bold mb-6 text-center">
            My Appointments
          </h1>

          {/* Charts */}
          <div className="max-w-5xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Status Pie Chart */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Appointment Status</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusSummary}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {statusSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Doctor Bar Chart */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Appointments per Doctor</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={doctorData}>
                  <XAxis dataKey="doctor" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Appointment Cards */}
          <div className="max-w-5xl mx-auto space-y-6">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{appt.doctor}</h2>
                    <p className="text-sm text-gray-500">
                      {appt.specialization} • {appt.hospital}
                    </p>
                  </div>
                  <span
                    className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${
                      appt.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <p><span className="font-semibold">Patient:</span> {appt.patient}</p>
                  <p><span className="font-semibold">Date:</span> {appt.date}</p>
                  <p><span className="font-semibold">Time:</span> {appt.time}</p>
                  <p><span className="font-semibold">Reason:</span> {appt.reason}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Reschedule
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;