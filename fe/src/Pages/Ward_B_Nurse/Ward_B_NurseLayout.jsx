import React from 'react';
import { Outlet } from 'react-router-dom';
import Ward_B_NurseSidebar from './Ward_B_NurseSidebar';

const Ward_B_NurseLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-64 flex-shrink-0 h-full">
        <Ward_B_NurseSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Ward_B_NurseLayout;