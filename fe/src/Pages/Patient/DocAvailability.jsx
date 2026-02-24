import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorsAvailability = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityData, setAvailabilityData] = useState([]);

  const doctors = [
    "Dr. Samantha Perera",
    "Dr. Nuwan Jayasinghe",
    "Dr. Malith Fernando",
    "Dr. Kavindi Silva",
    "Dr. Malindri Weerasinghe",
    "Dr. Samanthi Madushani",
  ];

  const generateRandomAvailability = () => {
    return doctors.map((doctor) => ({
      name: doctor,
      percentage: Math.floor(Math.random() * 101),
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (!date) {
      setAvailabilityData([]);
      return;
    }

    setAvailabilityData(generateRandomAvailability());
    toast.success(`Showing availability for ${date}`, { autoClose: 1500 });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 pt-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">
          Doctor Availability
        </h1>

        {/* Date Selector */}
        <div className="mb-6 w-full max-w-md bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Availability Grid */}
        {availabilityData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {availabilityData.map((doc, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white shadow-sm rounded-2xl p-5 border border-slate-200"
              >
                <div className="relative flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      strokeWidth="8"
                      stroke="#E5E7EB"
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke={
                        doc.percentage > 70
                          ? "#22c55e"
                          : doc.percentage > 40
                          ? "#facc15"
                          : "#ef4444"
                      }
                      strokeDasharray={2 * Math.PI * 32}
                      strokeDashoffset={
                        2 * Math.PI * 32 * (1 - doc.percentage / 100)
                      }
                      fill="transparent"
                      r="32"
                      cx="40"
                      cy="40"
                    />
                  </svg>

                  <span className="absolute text-sm font-bold text-slate-800">
                    {doc.percentage}%
                  </span>
                </div>

                <p className="text-center font-semibold text-slate-800">
                  {doc.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {availabilityData.length === 0 && selectedDate && (
          <p className="text-slate-600 mt-4">
            No availability data found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorsAvailability;
