import { Sidebar } from "flowbite-react";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineBeaker,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const ETU_NurseSidebar = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const itemClass = (path) =>
    `transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2
     ${
       isActive(path) ? "bg-blue-200 text-blue-900 font-semibold" : "text-slate-800 hover:bg-blue-100"
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
                onClick={() => navigate("/ETU_Nurse/dashboard/ETU_NurseDashboard")}
                icon={HiOutlineHome}
                className={itemClass("/ETU_Nurse/dashboard/ETU_NurseDashboard")}
              >
                Dashboard
              </Sidebar.Item>
  
              <Sidebar.Item
                onClick={() => navigate("/ETU_Nurse/dashboard/ETU_NurseForecast")}
                icon={HiOutlineChartBar}
                className={itemClass("/ETU_Nurse/dashboard/ETU_NurseForecast")}
              >
                Bed Forecasting
              </Sidebar.Item>

              {/* Sub-items for Bed Forecasting */}
              <div className="pl-6 mt-1 space-y-1">
                <Sidebar.Item
                  icon={HiOutlineClipboardList}
                  onClick={() => navigate("/ETU_Nurse/dashboard/ETU_NurseDailyInput")}
                  className={itemClass("/ETU_Nurse/dashboard/ETU_NurseDailyInput")}
                >
                  DailyInput
                </Sidebar.Item>

                <Sidebar.Item
                  icon={HiOutlineBeaker}
                  onClick={() => navigate("/ETU_Nurse/dashboard/ETU_NurseInventory")}
                  className={itemClass("/ETU_Nurse/dashboard/ETU_NurseInventory")}
                >
                  Inventory
                </Sidebar.Item>

                <Sidebar.Item
                  icon={HiOutlineChartBar}
                  onClick={() => navigate("/ETU_Nurse/dashboard/ETU_NurseForecast")}
                  className={itemClass("/ETU_Nurse/dashboard/ETU_NurseForecast")}
                >
                  Forecast
                </Sidebar.Item>

                <Sidebar.Item
                  icon={HiOutlineChartBar}
                  onClick={() => navigate("/ETU_Nurse/dashboard/ETU_NurseTrend")}
                  className={itemClass("/ETU_Nurse/dashboard/ETU_NurseTrend")}
                >
                  Trend
                </Sidebar.Item>
              </div>
  
              <Sidebar.Item
                onClick={() => navigate("/ETU_Nurse/dashboard/medicine")}
                icon={HiOutlineBeaker}
                className={itemClass("/ETU_Nurse/dashboard/medicine")}
              >
                Medicine
              </Sidebar.Item>
  
              <Sidebar.Item
                onClick={() => navigate("/ETU_Nurse/dashboard/equipment")}
                icon={HiOutlineClipboardList}
                className={itemClass("/ETU_Nurse/dashboard/equipment")}
              >
                Equipments
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

export default ETU_NurseSidebar;
