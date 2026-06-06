import { FaBars, FaSearch } from "react-icons/fa";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardSmallSidebar from "@/components/DashboardSmallSidebar";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useState } from "react";

const DashboardPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[270px_1fr] min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      <DashboardSmallSidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content */}
      <section className="mb-10 ">
        <header className="flex items-center justify-between w-full h-16 px-4 bg-white lg:hidden">
          {/* left: mobile menu already inside sidebar component */}
          <button onClick={toggleSidebar} className="text-2xl">
            <FaBars />
          </button>

          {/* center: title */}
          <span className="text-lg font-bold">RecipeVault</span>

          {/* right: profile */}
          <ProfileDropdown />
        </header>

        <header className="items-center justify-between hidden h-20 px-10 bg-white lg:flex">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute text-gray-600 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 ml-6">
            <ProfileDropdown />
          </div>
        </header>

        <Outlet />
      </section>
    </section>
  );
};

export default DashboardPage;
