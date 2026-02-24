import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiUser,
  HiLogout,
  HiClipboardList,
  HiBeaker,
  HiOfficeBuilding,
  HiCalendar,
  HiUsers
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const ETU_DocSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const { pathname } = useLocation();
  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const activeCls = "bg-gray-700 text-white";
  const inactiveCls = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <Sidebar className="w-64 bg-gray-800 text-white fixed h-screen shadow-lg">
      {/* Logo / Title */}
      <div className="flex flex-col items-center py-6">
        <img src="/img/logo.png" alt="Hospital Logo" className="w-16 mb-2" />
        <div className="text-lg font-bold">Doctor Panel</div>
      </div>

      <Sidebar.Items>
        {/* MAIN NAV */}
        <Sidebar.ItemGroup>
          <Sidebar.Item
            icon={HiHome}
            onClick={() => navigate("/ETU_Doctor/dashboard/ETU_DocDashboard")}
            className={`cursor-pointer ${isActive("/ETU_Doctor/dashboard/ETU_DocDashboard") ? activeCls : inactiveCls}`}
          >
            Dashboard
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiCalendar}
            onClick={() => navigate("/ETU_Doctor/dashboard/docAppointments")}
            className={`cursor-pointer ${isActive("/ETU_Doctor/dashboard/docAppointments") ? activeCls : inactiveCls}`}
          >
            Doctor Appointments
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiUsers}
            onClick={() => navigate("/ETU_Doctor/dashboard/docManage")}
            className={`cursor-pointer ${isActive("/ETU_Doctor/dashboard/docManage") ? activeCls : inactiveCls}`}
          >
            Doctor Management
          </Sidebar.Item>

          
        </Sidebar.ItemGroup>

        {/* BOTTOM ACTIONS */}
        <Sidebar.ItemGroup className="mt-auto">
          <Sidebar.Item
            icon={HiUser}
            onClick={() => navigate("/profile")}
            className={`cursor-pointer ${isActive("/profile") ? activeCls : inactiveCls}`}
          >
            Profile
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiLogout}
            onClick={logout}
            className="cursor-pointer text-red-400 hover:bg-red-600 hover:text-white"
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default ETU_DocSidebar;
