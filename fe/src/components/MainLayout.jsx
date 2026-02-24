import Navbar from "./Navbar";
import HospitalFooter from "./MyFooter";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      {/* 
        pt-16  → if Navbar height is ~64px
        pt-20  → if Navbar height is ~80px
      */}
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>

      <HospitalFooter />
    </>
  );
};

export default MainLayout;
