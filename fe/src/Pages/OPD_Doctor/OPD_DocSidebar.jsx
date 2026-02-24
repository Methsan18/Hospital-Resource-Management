import { Sidebar } from "flowbite-react";
import {
  HiHome,
  HiUser,
  HiLogout,
  HiClipboardList,
  HiBeaker,
  HiOfficeBuilding
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ETU_DocSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Sidebar className="h-screen border-r">
      {/* Logo */}
      <div className="flex justify-center py-6">
        <img src="/img/logo.png" alt="Hospital Logo" className="w-20" />
      </div>

      <Sidebar.Items>
        {/* MAIN NAV */}
        <Sidebar.ItemGroup>
          <Sidebar.Item icon={HiHome} href="/bedoccupancy/dashboard">
            Dashboard
          </Sidebar.Item>

          <Sidebar.Item icon={HiOfficeBuilding} href="/bedoccupancy/dashboard/beds">
            Bed Occupancy
          </Sidebar.Item>

          <Sidebar.Item icon={HiBeaker} href="/medicine/dashboard">
            Medicines
          </Sidebar.Item>

          <Sidebar.Item icon={HiClipboardList} href="/medicine/dashboard/manage_eqp">
            Equipment
          </Sidebar.Item>
        </Sidebar.ItemGroup>

        {/* BOTTOM ACTIONS */}
        <Sidebar.ItemGroup>
          <Sidebar.Item icon={HiUser} href="/profile">
            Profile
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiLogout}
            onClick={logout}
            className="cursor-pointer text-red-600"
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default ETU_DocSidebar;
