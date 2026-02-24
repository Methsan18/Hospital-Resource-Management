import React, { useState } from "react";

const DoctorManageAdmin = () => {
  const [activeTab, setActiveTab] = useState("doctors");

  // Dummy data
  const doctorData = [
    { id: 1, name: "Dr. Samadhi Wijethunga", specialization: "Cardiologist", status: "Active" },
    { id: 2, name: "Dr. Nuwan Jayasinghe", specialization: "Dermatologist", status: "Pending" },
    { id: 3, name: "Dr. Methsan Herath", specialization: "Orthopedic", status: "Active" },
  ];

  const appointmentData = [
    { id: 1, doctor: "Dr. Samantha Perera", patient: "Chamika Adikari", date: "2026-01-05", status: "Confirmed" },
    { id: 2, doctor: "Dr. Nuwan Jayasinghe", patient: "Chamika Adikari", date: "2026-01-07", status: "Pending" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 fixed h-full shadow-lg">
        <h2 className="text-2xl font-bold mb-20">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`w-full text-left py-2 px-4 rounded text-lg ${
                activeTab === "doctors" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              Manage Doctors
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`w-full text-left py-2 px-4 rounded text-lg ${
                activeTab === "appointments" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              Manage Appointments
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left py-2 px-4 rounded text-lg ${
                activeTab === "reports" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              Reports
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {/* Manage Doctors */}
        {activeTab === "doctors" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Doctors List</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {doctorData.map((doc) => (
                <div key={doc.id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold">{doc.name}</h3>
                  <p>Specialization: {doc.specialization}</p>
                  <p>Status: {doc.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage Appointments */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Appointments List</h2>
            <div className="space-y-4">
              {appointmentData.map((appt) => (
                <div key={appt.id} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
                  <p><strong>Doctor:</strong> {appt.doctor}</p>
                  <p><strong>Patient:</strong> {appt.patient}</p>
                  <p><strong>Date:</strong> {appt.date}</p>
                  <p><strong>Status:</strong> {appt.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reports (Coming Soon)</h2>
            <p>Analytics and charts will be added here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManageAdmin;