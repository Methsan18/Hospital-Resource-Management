import React from 'react';
import { Outlet } from 'react-router-dom';
import StoreManagerSidebar from './StoreManagerSidebar';

const StoreManagerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-64 flex-shrink-0 h-full">
        <StoreManagerSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default StoreManagerLayout;