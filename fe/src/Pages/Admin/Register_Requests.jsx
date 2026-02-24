import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaPills,
  FaUserMd,
  FaUserNurse,
  FaVirus,
  FaBoxes
} from "react-icons/fa";

const roles = [
  {
    title: "System Administrators",
    description: "Manage system users, permissions, and configurations",
    icon: <FaUserShield size={36} />,
    path: "/admin/register/admin"
  },
  {
    title: "Pharmacy Staff",
    description: "Pharmacists, chief pharmacists & ward nurses (medicine handling)",
    icon: <FaPills size={36} />,
    path: "/admin/register/pharmacy"
  },
  {
    title: "Medical Officers",
    description: "Doctors & consultants (availability & scheduling)",
    icon: <FaUserMd size={36} />,
    path: "/admin/register/doctors"
  },
  {
    title: "Nursing Management",
    description: "Head nurses & ward head nurses (bed occupancy & wards)",
    icon: <FaUserNurse size={36} />,
    path: "/admin/register/nursing"
  },
  {
    title: "Public Health & Surveillance",
    description: "Seasonal illness & outbreak monitoring team",
    icon: <FaVirus size={36} />,
    path: "/admin/register/public-health"
  },
  {
    title: "Inventory & Supply Chain",
    description: "Medicine & medical equipment inventory managers",
    icon: <FaBoxes size={36} />,
    path: "/admin/register/inventory"
  }
];

const AdminRegisterRequests = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 min-h-screen bg-blue-50">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          User Registration Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Review requests and register users under appropriate hospital roles
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4 mb-4 text-blue-700">
              {role.icon}
              <h2 className="text-xl font-semibold">{role.title}</h2>
            </div>

            <p className="text-gray-600 mb-6">{role.description}</p>

            <button
              onClick={() => navigate(role.path)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Manage Registrations
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRegisterRequests;
