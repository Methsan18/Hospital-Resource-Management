import React from "react";
import { useParams } from "react-router-dom";

export default function DoctorProfile() {
  const { id } = useParams();

  // Preview doctor data (replace with API later using id)
  const doctor = {
    name: "Dr. Samadhi Wijethunga",
    specialization: "Cardiology",
    photo: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
  };

  // Weekly availability (preview)
  const weeklySchedule = [
    { day: "Monday", availability: 87 },
    { day: "Tuesday", availability: 61 },
    { day: "Wednesday", availability: 40 },
    { day: "Thursday", availability: 75 },
    { day: "Friday", availability: 83 },
    { day: "Saturday", availability: 50 },
    { day: "Sunday", availability: 20 },
  ];

  const availabilityStyle = (val) => {
    if (val >= 80) return "bg-green-100 border-green-200 text-green-800";
    if (val >= 50) return "bg-yellow-100 border-yellow-200 text-yellow-800";
    return "bg-red-100 border-red-200 text-red-800";
  };

  const availabilityLabel = (val) => {
    if (val >= 80) return "High";
    if (val >= 50) return "Medium";
    return "Low";
  };

  return (
    <div className="min-h-screen bg-blue-100 px-4 sm:px-6 lg:px-10 pt-6 pb-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <img
              src={doctor.photo}
              alt="Doctor"
              className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-200 p-2"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {doctor.name}
              </h1>
              <p className="text-slate-600 text-base sm:text-lg">
                {doctor.specialization}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Profile ID: <span className="font-semibold">{id}</span>
              </p>
            </div>
          </div>

          <div className="sm:ml-auto flex gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              OPD / Clinic
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
              Weekly Schedule
            </span>
          </div>
        </div>

        {/* Weekly Availability */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-200 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Weekly Availability
              </h2>
              <p className="text-sm text-slate-600">
                Percent availability preview for each day.
              </p>
            </div>

            <div className="text-xs text-slate-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Sample data (replace with API later)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklySchedule.map((day, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-4 ${availabilityStyle(day.availability)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{day.day}</h3>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/70 border">
                    {availabilityLabel(day.availability)}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-3xl font-extrabold">
                    {day.availability}%
                  </div>
                  <div className="text-sm font-semibold">Available</div>
                </div>

                {/* progress bar */}
                <div className="w-full bg-white/60 rounded-full h-2 mt-3 overflow-hidden border">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${day.availability}%`,
                      background:
                        day.availability >= 80
                          ? "#22c55e"
                          : day.availability >= 50
                          ? "#facc15"
                          : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
}
