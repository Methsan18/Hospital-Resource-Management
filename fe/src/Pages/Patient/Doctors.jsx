import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [specialty, setSpecialty] = useState("All");
  const [search, setSearch] = useState("");

  // --- Sample Doctors (Replace later with API) ---
  const doctors = [
    {
      id: 1,
      name: "Dr. Samantha Perera",
      specialty: "General OPD",
      room: "OPD - 02",
      days: [
        { date: "Mon", availability: 85, time: "8.00 AM – 12.00 PM" },
        { date: "Tue", availability: 60, time: "9.00 AM – 1.00 PM" },
        { date: "Wed", availability: 40, time: "8.00 AM – 12.00 PM" },
      ],
    },
    {
      id: 2,
      name: "Dr. Nuwan Jayasinghe",
      specialty: "Cardiology",
      room: "Clinic - 01",
      days: [
        { date: "Mon", availability: 70, time: "10.00 AM – 2.00 PM" },
        { date: "Tue", availability: 55, time: "10.00 AM – 2.00 PM" },
        { date: "Wed", availability: 30, time: "10.00 AM – 2.00 PM" },
      ],
    },
    {
      id: 3,
      name: "Dr. Kavindi Silva",
      specialty: "Pediatrics",
      room: "Clinic - 03",
      days: [
        { date: "Mon", availability: 92, time: "8.30 AM – 12.30 PM" },
        { date: "Tue", availability: 78, time: "8.30 AM – 12.30 PM" },
        { date: "Wed", availability: 65, time: "8.30 AM – 12.30 PM" },
      ],
    },
    {
      id: 4,
      name: "Dr. Malith Fernando",
      specialty: "Medical Clinic",
      room: "Clinic - 02",
      days: [
        { date: "Mon", availability: 62, time: "9.00 AM – 1.00 PM" },
        { date: "Tue", availability: 45, time: "9.00 AM – 1.00 PM" },
        { date: "Wed", availability: 25, time: "9.00 AM – 1.00 PM" },
      ],
    },
  ];

  const specialties = useMemo(() => {
    const set = new Set(doctors.map((d) => d.specialty));
    return ["All", ...Array.from(set)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((d) => (specialty === "All" ? true : d.specialty === specialty))
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [doctors, specialty, search]);

  const badgeColor = (pct) => {
    if (pct >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (pct >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-blue-100 px-4 sm:px-6 lg:px-10 pt-6 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Patient Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Check doctors available for the next few days and plan your visit.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor name..."
                className="w-full sm:w-72 px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
              />

              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full sm:w-56 px-4 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigate("/doctor-availability")}
              className="px-5 py-2 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
            >
              View Full Availability
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {doc.name}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {doc.specialty} • {doc.room}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/doctor/${doc.id}`)}
                  className="text-sm px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-semibold text-slate-700"
                >
                  View Profile
                </button>
              </div>

              {/* Next Days Availability */}
              <div className="mt-5">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  Next Days Availability
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {doc.days.map((d, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{d.date}</span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full border ${badgeColor(
                            d.availability
                          )}`}
                        >
                          {d.availability}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-2">
                        ⏰ {d.time}
                      </div>

                      <div className="w-full bg-white rounded-full h-2 mt-3 overflow-hidden border border-slate-200">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${d.availability}%`,
                            background:
                              d.availability >= 70
                                ? "#22c55e"
                                : d.availability >= 40
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
          ))}

          {filteredDoctors.length === 0 && (
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-600">
              No doctors found for your search/filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
