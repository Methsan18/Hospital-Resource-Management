import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ETUAdminDashboard = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Perera",
      specialty: "Cardiology",
      status: "On-duty", // On-duty | Off-duty | On-call
      lastCheckIn: "09:15 AM",
      currentPatients: 12,
      maxPatients: 20,
    },
    {
      id: 2,
      name: "Dr. Silva",
      specialty: "Trauma",
      status: "On-call",
      lastCheckIn: "08:50 AM",
      currentPatients: 8,
      maxPatients: 20,
    },
    {
      id: 3,
      name: "Dr. Fernando",
      specialty: "Neurology",
      status: "Off-duty",
      lastCheckIn: "N/A",
      currentPatients: 0,
      maxPatients: 20,
    },
    {
      id: 4,
      name: "Dr. Kumara",
      specialty: "Emergency Medicine",
      status: "On-duty",
      lastCheckIn: "09:40 AM",
      currentPatients: 5,
      maxPatients: 15,
    },
  ]);

  const [animatedDoctors, setAnimatedDoctors] = useState([]);

  // Animate patient load and doctor availability circles
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setAnimatedDoctors(
        doctors.map((doc) => ({
          ...doc,
          animatedAvailability: Math.min(i, Math.floor((doc.currentPatients / doc.maxPatients) * 100)),
        }))
      );
      if (i >= 100) clearInterval(interval);
    }, 15);
  }, [doctors]);

  // Helper: get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "On-duty":
        return "bg-green-500";
      case "On-call":
        return "bg-yellow-400";
      case "Off-duty":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#eaf5ff] via-[#f3f8ff] to-[#eef6ff] font-sans text-[#0f172a]">

      <h1 className="text-3xl font-bold text-[#0b2b5a] mb-6">
        🏥 ETU Doctor Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        {/* LEFT SIDE (Doctors) */}
        <div className="col-span-3 space-y-6">

          {animatedDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center transition-shadow border border-gray-100"
            >
              <div>
                <p className="font-semibold text-lg">{doc.name}</p>
                <p className="text-sm">{doc.specialty}</p>
                <p className="text-sm">Last check-in: {doc.lastCheckIn}</p>
                
              </div>

              {/* Status Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full ${getStatusColor(doc.status)} relative flex items-center justify-center ring-2 ring-white`}
                  title={doc.status}
                >
                  <span className="text-white font-bold text-sm">{doc.status === "On-duty" ? "✔" : doc.status === "On-call" ? "⚡" : "✖"}</span>
                </div>

                {/* Patient load bar */}
                <div className="w-24 mt-2 bg-gray-200 h-3 rounded">
                  <div
                    className="bg-purple-600 h-3 rounded transition-all duration-500"
                    style={{ width: `${doc.animatedAvailability || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col gap-2 ml-4">
                <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm shadow-sm">
                  📞 Call
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm shadow-sm">
                  📝 Notes
                </button>
                <button className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors text-sm shadow-sm">
                  ⚡ Assign
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT SIDE (ETU Stats) */}
        <div className="space-y-6">

          {/* Total Patients */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📊 ETU Stats</h2>
            <p className="text-sm mb-2">Total Doctors: {doctors.length}</p>
            <p className="text-sm mb-2">Total Patients: {doctors.reduce((sum, d) => sum + d.currentPatients, 0)}</p>
            <p className="text-sm mb-2">Doctors Available: {doctors.filter(d => d.status === "On-duty").length}</p>

            {/* Mini progress bars */}
            <div className="mt-4 space-y-2">
              {doctors.map((doc) => {
                const loadPercent = Math.floor((doc.currentPatients / doc.maxPatients) * 100);
                return (
                  <div key={doc.id}>
                    <p className="text-sm">{doc.name}</p>
                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="bg-purple-600 h-3 rounded transition-all duration-500 shadow-inner"
                        style={{ width: `${loadPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
            <button className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm">
              ➕ Add Doctor
            </button>
            <button className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm">
              🛑 Remove Doctor
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ETUAdminDashboard;