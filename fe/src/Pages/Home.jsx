import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://w0.peakpx.com/wallpaper/315/432/HD-wallpaper-medical-hospital.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Welcome to HospitalCare
        </h1>

        <p className="text-lg md:text-xl mb-8 text-blue-100">
          View available doctors, check schedules for upcoming days, and plan
          your hospital visit with confidence.
        </p>

        {/* Info strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            🕒 OPD Hours <br />
            <span className="font-semibold">Mon – Fri</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            👨‍⚕️ Certified Doctors <br />
            <span className="font-semibold">Multiple Specialties</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            🚑 Emergency Care <br />
            <span className="font-semibold">24 × 7</span>
          </div>
        </div>

        {/* ✅ Get Started Button */}
        <button
          onClick={() => navigate("/dashboard_patient")}
          className="mt-10 px-8 py-3 rounded-full bg-blue-800 hover:bg-blue-300 text-white font-semibold transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
