import React from 'react';
import { Outlet } from 'react-router-dom';
import PharmacistSidebar from './PharmacistSidebar';

const PharmacistLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-64 flex-shrink-0 h-full">
        <PharmacistSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default PharmacistLayout;