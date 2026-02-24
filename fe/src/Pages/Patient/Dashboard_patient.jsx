import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const UserDashboard = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("si"); // default Sinhala

  const text = {
    si: {
      welcome: "ඔබව සාදරයෙන් පිළිගනිමු",
      healthAlerts: "සෞඛ්‍ය දැනුම්දීම්",
      washHands: "අත් නිතර සෝදන්න",
      wearMask: "මස්ක් භාවිතා කරන්න",
      fever: "උණ / කැස්ස ඇත්නම් දැනුම් දෙන්න",
      doctorsToday: "අද ලබා ගත හැකි වෛද්‍යවරු",
      checkAvailability: "වෛද්‍ය ලබාගත හැකිද පරීක්ෂා කරන්න",
      opdInfo: "OPD තොරතුරු (ශ්‍රී ලංකා)",
      opdTime: "සාමාන්‍ය OPD වේලාව",
      opdEmergency: "හදිසි ප්‍රතිකාර 24x7 ලබා ගත හැක",
      opdDays: "සඳුදා – සිකුරාදා",
      opdHours: "පෙ.ව. 8.00 – ම.ද. 12.00",
    },
    ta: {
      welcome: "வரவேற்கிறோம்",
      healthAlerts: "சுகாதார அறிவுறுத்தல்கள்",
      washHands: "கைகளை அடிக்கடி கழுவவும்",
      wearMask: "மாஸ்க் அணியவும்",
      fever: "காய்ச்சல் / இருமல் இருந்தால் தெரிவிக்கவும்",
      doctorsToday: "இன்றைய மருத்துவர்கள்",
      checkAvailability: "மருத்துவர் கிடைப்பை சரிபார்க்கவும்",
      opdInfo: "OPD தகவல் (இலங்கை)",
      opdTime: "சாதாரண OPD நேரம்",
      opdEmergency: "அவசர சிகிச்சை 24x7",
      opdDays: "திங்கள் – வெள்ளி",
      opdHours: "காலை 8.00 – மதியம் 12.00",
    },
    en: {
      welcome: "Welcome",
      healthAlerts: "Health Alerts",
      washHands: "Wash hands frequently",
      wearMask: "Wear a face mask",
      fever: "Inform staff if you have fever or cough",
      doctorsToday: "Doctors Available Today",
      checkAvailability: "Check Doctor Availability",
      opdInfo: "OPD Information (Sri Lanka)",
      opdTime: "General OPD Time",
      opdEmergency: "Emergency services available 24x7",
      opdDays: "Monday – Friday",
      opdHours: "8.00 AM – 12.00 PM",
    },
  };

  const t = text[language];

  // Sample doctor availability
  const doctors = [
    { name: "Dr. Perera", specialty: "General OPD", time: "8.00 AM – 12.00 PM", availability: 85 },
    { name: "Dr. Silva", specialty: "Medical Clinic", time: "9.00 AM – 1.00 PM", availability: 60 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-25 left-6 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-100 transition"
        aria-label="Back to Home"
      >
        <FaArrowLeft className="text-blue-600" />
      </button>

      {/* Language Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
          <option value="en">English</option>
        </select>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t.welcome}
      </h1>

      {/* Main Layout 3:1 */}
      <div className="grid grid-cols-4 gap-6">

        {/* LEFT SIDE (3 columns) */}
        <div className="col-span-3 space-y-6">

          {/* Health Alerts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              🚨 {t.healthAlerts}
            </h2>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-red-50 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                <img
                  src="https://img.icons8.com/emoji/48/000000/mask-emoji.png"
                  alt="mask"
                  className="mx-auto"
                />
                <p className="mt-2">{t.wearMask}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                <img
                  src="https://img.icons8.com/fluency/48/000000/hand-wash.png"
                  alt="wash hands"
                  className="mx-auto"
                />
                <p className="mt-2">{t.washHands}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                <img
                  src="https://img.icons8.com/emoji/48/000000/face-with-thermometer.png"
                  alt="fever"
                  className="mx-auto"
                />
                <p className="mt-2">{t.fever}</p>
              </div>
            </div>
          </div>

          {/* OPD Status with progress bars */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🏥 OPD Status</h2>
            <div className="space-y-4">
              <div>
                <p>🟢 Open</p>
                <div className="w-full bg-gray-200 h-4 rounded">
                  <div
                    className="bg-green-500 h-4 rounded transition-all duration-500"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>

              <div>
                <p>🟡 High Crowd</p>
                <div className="w-full bg-gray-200 h-4 rounded">
                  <div
                    className="bg-yellow-400 h-4 rounded transition-all duration-500"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>

              <div>
                <p>🔴 Closed</p>
                <div className="w-full bg-gray-200 h-4 rounded">
                  <div
                    className="bg-red-500 h-4 rounded transition-all duration-500"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE (1 column) */}
        <div className="space-y-6">

          {/* Doctors Available Today */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              👨‍⚕️ {t.doctorsToday}
            </h2>

            <div className="space-y-3">
              {doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50 rounded flex justify-between items-center hover:bg-green-100 transition-colors"
                >
                  <div>
                    <span className="font-medium">{doc.name}</span> <br />
                    {doc.specialty} <br />
                    ⏰ {doc.time}
                  </div>

                  <div className="w-12 h-12 relative">
                    <svg viewBox="0 0 36 36" className="w-12 h-12">
                      <circle
                        className="text-gray-200"
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                      />
                      <circle
                        className="text-green-500"
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeDasharray={`${doc.availability}, 100`}
                        strokeDashoffset="25"
                      />
                      <text
                        x="18"
                        y="20"
                        className="text-xs font-bold text-gray-700"
                        textAnchor="middle"
                      >
                        {doc.availability}%
                      </text>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/doctors")}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🩺 {t.checkAvailability}
            </button>
          </div>

          {/* OPD Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              📌 {t.opdInfo}
            </h2>

            <p className="mb-2 font-medium">{t.opdTime}</p>
            <ul className="list-disc ml-5 text-sm">
              <li>{t.opdDays}</li>
              <li>{t.opdHours}</li>
            </ul>

            <p className="mt-3 text-sm">
              🚑 {t.opdEmergency}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

///doctors