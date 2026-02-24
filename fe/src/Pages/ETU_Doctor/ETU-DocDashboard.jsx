import React, { useState } from "react";


const ETU_DocDashboard = () => {
  const [openDoctor, setOpenDoctor] = useState(null);
  const [openAppt, setOpenAppt] = useState(null);

  const doctors = [
    { id: 1, name: "Dr. Samantha Perera", specialization: "Cardiologist", contact: "077-1234567", email: "samantha.perera@example.com", availability: "Mon-Fri • 8:00 AM – 12:00 PM" },
    { id: 2, name: "Dr. Nuwan Jayasinghe", specialization: "Dermatologist", contact: "077-2345678", email: "nuwan.j@example.com", availability: "Tue-Thu • 9:00 AM – 1:00 PM" },
    { id: 3, name: "Dr. Methsan Herath", specialization: "Orthopedic", contact: "077-3456789", email: "methsan.h@example.com", availability: "Mon, Wed • 2:00 PM – 6:00 PM" },
  ];

  const appointments = [
    { id: 1, patient: "Chamika Adikari", doctor: "Dr. Samantha Perera", date: "2026-01-05", time: "10:00 AM", status: "Confirmed", reason: "Follow-up" },
    { id: 2, patient: "Nimal Perera", doctor: "Dr. Nuwan Jayasinghe", date: "2026-01-07", time: "11:30 AM", status: "Pending", reason: "Skin rash" },
    { id: 3, patient: "Samantha Silva", doctor: "Dr. Methsan Herath", date: "2026-01-09", time: "2:00 PM", status: "Confirmed", reason: "Knee pain" },
  ];

  return (
    <div className="w-full min-h-screen bg-blue-100 p-6 mt-20">

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Doctor Dashboard
      </h1> 





      {/* Appointments & Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>

          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="bg-gray-50 border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{a.patient}</p>
                    <p className="text-sm text-gray-500">{a.doctor} • {a.date} • {a.time}</p>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${a.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{a.status}</span>
                    <button onClick={() => setOpenAppt(openAppt === a.id ? null : a.id)} className="ml-3 text-sm text-blue-600">View</button>
                  </div>
                </div>

                {openAppt === a.id && (
                  <div className="mt-3 text-sm text-gray-700">
                    <p><strong>Reason:</strong> {a.reason}</p>
                    <p><strong>Contact:</strong> {a.contact || '077-0000000'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Doctors Directory</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {doctors.map((d) => (
              <div key={d.id} className="border border-slate-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-sm text-gray-500">{d.specialization}</p>
                    <p className="text-sm text-gray-500">{d.availability}</p>
                  </div>

                  <div className="text-right">
                    <button onClick={() => setOpenDoctor(openDoctor === d.id ? null : d.id)} className="text-sm text-blue-600">Details</button>
                  </div>
                </div>

                {openDoctor === d.id && (
                  <div className="mt-3 text-sm text-gray-700">
                    <p><strong>Contact:</strong> {d.contact}</p>
                    <p><strong>Email:</strong> {d.email}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow-md rounded-xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>

        <ul className="space-y-3">

          <li className="bg-yellow-100 text-yellow-800 p-3 rounded-lg border border-yellow-300">
            ⚠ Emergency ward expected surge due to <strong>road accidents</strong>.
          </li>

          <li className="bg-blue-100 text-blue-800 p-3 rounded-lg border border-blue-300">
            ℹ 18 patient discharges expected today.
          </li>

          <li className="bg-orange-100 text-orange-800 p-3 rounded-lg border border-orange-300">
            ⚠ Low stock of <strong>IV fluids</strong> may affect treatments; consider restock.
          </li>

        </ul>
      </div>

    </div>
  );
};

export default ETU_DocDashboard;
