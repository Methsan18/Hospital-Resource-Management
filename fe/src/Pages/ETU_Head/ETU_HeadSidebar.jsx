import { Sidebar } from "flowbite-react";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineBeaker,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const ETU_HeadSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bedsOpen, setBedsOpen] = useState(false);
  const [illnessOpen, setIllnessOpen] = useState(false);

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const itemClass = (path) =>
    `transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2 ${
      isActive(path)
        ? "bg-blue-200 text-blue-900 font-semibold"
        : "text-slate-800 hover:bg-blue-100"
    }`;

  // Corrected Paths to match the actual navigation links below
  const bedsPaths = [
    "/ETU_Head/dashboard/optimization",
    "/ETU_Head/dashboard/trend",
    "/ETU_Head/dashboard/ETU_BedInventory",
  ];

  const isBedsActive = bedsPaths.includes(location.pathname);

  // Corrected Paths to match the actual navigation links below
  const illnessPaths = [
    "/ETU_Head/dashboard/ETU_HeadIllnessAlerts",
    "/ETU_Head/dashboard/ETU_HeadIllnessForecast",
    "/ETU_Head/dashboard/ETU_HeadIllnessTrendsPage",
  ];
  
  const isIllnessActive = illnessPaths.includes(location.pathname);

  return (
    <Sidebar aria-label="ETU Head Sidebar" className="h-screen w-64 border-r border-blue-200">
      {/* Gradient sidebar with full-height scrolling */}
      <div className="h-full bg-gradient-to-b from-blue-100 via-blue-400 to-blue-800 p-3 overflow-y-auto">
        
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
              onClick={() => navigate("/ETU_Head/dashboard/dashboard")}
              icon={HiOutlineHome}
              className={itemClass("/ETU_Head/dashboard/dashboard")}
            >
              Dashboard
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/graphs")}
              icon={HiOutlineChartBar}
              className={itemClass("/ETU_Head/dashboard/graphs")}
            >
              Forecast
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/medandequip")}
              icon={HiOutlineBeaker}
              className={itemClass("/ETU_Head/dashboard/medandequip")}
            >
              Inventory
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/doctors")}
              icon={HiOutlineBeaker}
              className={itemClass("/ETU_Head/dashboard/doctors")}
            >
              Doctor Details
            </Sidebar.Item>

            {/* Bed Forecasting: Collapsible Parent Group */}
            <div className="bg-transparent mt-4">
              <Sidebar.Item
                onClick={() => setBedsOpen(!bedsOpen)} /* TOGGLE ONLY - No Navigation */
                icon={HiOutlineChartBar}
                className={`cursor-pointer transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2 ${
                  isBedsActive
                    ? "bg-blue-200 text-blue-900 font-semibold"
                    : "text-slate-800 hover:bg-blue-100"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Bed Forecasting</span>
                  <HiOutlineChevronDown
                    className={`ml-2 transform transition-transform duration-200 ${
                      bedsOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </Sidebar.Item>

              {/* Sub-Pages (Only displayed when Bed Forecasting is clicked/Open) */}
              {bedsOpen && (
                <div className="pl-6 mt-2 space-y-1">
                  {/* Sub-Page 1: Optimization */}
                  <Sidebar.Item
                    onClick={() => navigate("/ETU_Head/dashboard/optimization")}
                    icon={HiOutlineClipboardList}
                    className={itemClass("/ETU_Head/dashboard/optimization")}
                  >
                    Optimization Page
                  </Sidebar.Item>

                  {/* Sub-Page 2: Trends */}
                  <Sidebar.Item
                    onClick={() => navigate("/ETU_Head/dashboard/trend")}
                    icon={HiOutlineChartBar}
                    className={itemClass("/ETU_Head/dashboard/trend")}
                  >
                    Trend Page
                  </Sidebar.Item>

                  <Sidebar.Item
                    onClick={() => navigate("/ETU_Head/dashboard/ETU_BedInventory")}
                    icon={HiOutlineChartBar}
                    className={itemClass("/ETU_Head/dashboard/ETU_BedInventory")}
                  >
                    Bed Inventory
                  </Sidebar.Item>
                </div>
              )}
            </div>

            {/* Illness Forecasting: separate collapsible section */}
            <div className="bg-transparent mt-4">
              <Sidebar.Item
                onClick={() => setIllnessOpen((s) => !s)}
                icon={HiOutlineChartBar}
                className={`transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2 ${
                  isIllnessActive
                    ? "bg-blue-200 text-blue-900 font-semibold"
                    : "text-slate-800 hover:bg-blue-100"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>Illness Forecasting</span>
                  <HiOutlineChevronDown
                    className={`ml-2 transform transition-transform ${
                      illnessOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </Sidebar.Item>

              {illnessOpen && (
                <div className="pl-6 mt-2 space-y-1">
                  <Sidebar.Item
                    onClick={() => navigate("/ETU_Head/dashboard/ETU_HeadIllnessAlerts")}
                    icon={HiOutlineChartBar}
                    className={itemClass("/ETU_Head/dashboard/ETU_HeadIllnessAlerts")}
                  >
                    Alerts
                  </Sidebar.Item>

                  <Sidebar.Item
                    onClick={() => navigate("/ETU_Head/dashboard/ETU_HeadIllnessForecast")}
                    icon={HiOutlineBeaker}
                    className={itemClass("/ETU_Head/dashboard/ETU_HeadIllnessForecast")}
                  >
                    Forecast Page
                  </Sidebar.Item>

                  <Sidebar.Item
                    onClick={() => navigate("/ETU_Head/dashboard/ETU_HeadIllnessTrendsPage")}
                    icon={HiOutlineClipboardList}
                    className={itemClass("/ETU_Head/dashboard/ETU_HeadIllnessTrendsPage")}
                  >
                    Trends
                  </Sidebar.Item>
                </div>
              )}
            </div>
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

export default ETU_HeadSidebar;