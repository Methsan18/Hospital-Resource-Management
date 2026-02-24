import { Sidebar } from "flowbite-react";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineBeaker,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const PharmacistSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const itemClass = (path) =>
    `transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2
     ${
       isActive(path)
         ? "bg-blue-200 text-blue-900 font-semibold"
         : "text-slate-800 hover:bg-blue-100"
     }`;

  return (
    <Sidebar aria-label="Pharmacist Sidebar" className="h-screen w-64 border-r border-blue-200">
      {/* Slightly lighter blue – not pastel */}
      <div className="h-full bg-gradient-to-b from-blue-100 via-blue-400 to-blue-800 p-3">
        
        {/* Logo (clean, no outline, no box) */}
        <div className="flex justify-center items-center py-6">
          <img
            src="/img/logo.png"
            alt="Hospital Logo"
            className="w-20 h-20 mt-9 mb-9 object-contain"
          />
        </div>

        <Sidebar.Items className="bg-transparent">
          <Sidebar.ItemGroup className="bg-transparent space-y-1">

            <Sidebar.Item
              onClick={() => navigate("/Pharmacist/dashboard/PharmacistDashboard")}
              icon={HiOutlineHome}
              className={itemClass("/Pharmacist/dashboard/PharmacistDashboard")}
            >
              Dashboard
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/Pharmacist/dashboard/prescriptions")}
              icon={HiOutlineClipboardList}
              className={itemClass("/Pharmacist/dashboard/prescriptions")}
            >
              Prescriptions
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/Pharmacist/dashboard/dispense")}
              icon={HiOutlineBeaker}
              className={itemClass("/Pharmacist/dashboard/dispense")}
            >
              Dispense
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/Pharmacist/dashboard/inventory-requests")}
              icon={HiOutlineClipboardList}
              className={itemClass("/Pharmacist/dashboard/inventory-requests")}
            >
              Inventory Requests
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/Pharmacist/dashboard/analytics")}
              icon={HiOutlineChartBar}
              className={itemClass("/Pharmacist/dashboard/analytics")}
            >
              Analytics
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/Pharmacist/dashboard/equipment")}
              icon={HiOutlineClipboardList}
              className={itemClass("/Pharmacist/dashboard/equipment")}
            >
              Equipment
            </Sidebar.Item>
          </Sidebar.ItemGroup>

          {/* Logout */}
          <Sidebar.ItemGroup className="bg-transparent mt-6">
            <Sidebar.Item
              icon={HiOutlineLogout}
              onClick={userLogout}
              className="transition-all duration-200 rounded-lg px-3 py-2 text-slate-800 hover:bg-red-100 hover:text-red-700"
            >
              Log Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default PharmacistSidebar;
