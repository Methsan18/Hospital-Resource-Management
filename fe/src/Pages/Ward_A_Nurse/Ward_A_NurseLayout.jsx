import React from 'react';
import { Outlet } from 'react-router-dom';
import Ward_A_NurseSidebar from './Ward_A_NurseSidebar';

const Ward_A_NurseLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-64 flex-shrink-0 h-full">
        <Ward_A_NurseSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Ward_A_NurseLayout;