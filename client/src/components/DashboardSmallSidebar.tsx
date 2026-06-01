import clsx from "clsx";
import React from "react";
import { FaBook, FaHeart, FaHome, FaPlus } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router";

const DashboardSmallSidebar = () => {
  return (
    <aside className=" lg:hidden">
      <div
        className={clsx(
          "sidebar-container fixed inset-0 bg-white flex items-center justify-center   transition-opacity ",
        )}
      >
        <div className="content h-[95vh] flex flex-col justify-center text-xl gap-8 relative w-full">
          {/* Close button */}
          <button className="absolute text-2xl font-bold top-2 right-8">
            ✕
          </button>

          <Link
            to="/"
            className="absolute flex items-center text-xl -translate-x-1/2 top-8 left-1/2"
          >
            <div className="w-10 h-10 bg-black rounded-full" />
            <span className="ml-2 italic font-bold">RecipeVault</span>
          </Link>

          <Link
            to="/"
            className="flex flex-col items-center gap-2 font-semibold"
          >
            <FaBook className="w-7 h-7" />
            <span>Your recipes</span>
          </Link>

          <Link
            to="/favorites"
            className="flex flex-col items-center gap-2 font-semibold"
          >
            <FaPlus className="w-7 h-7" />
            <span>Create Recipe</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSmallSidebar;
