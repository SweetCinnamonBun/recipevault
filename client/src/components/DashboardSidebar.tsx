import React from 'react'
import { FaBook, FaPlus } from 'react-icons/fa'
import { GrAnalytics } from 'react-icons/gr'
import { Link } from 'react-router'
import TestPfpImg from "@/assets/images/pexels-ella-olsson-572949-1640777.jpg";
import { User } from '@/types/Recipe';

interface DashboardSidebarProps {
    user: User | null
}

const DashboardSidebar = ({user}: DashboardSidebarProps) => {
  return (
    <aside className="hidden bg-white lg:block">
        <div className="sticky top-0 flex flex-col h-screen px-2">
          <Link to="/" className="p-10 text-2xl text-center">
            RecipeVault
          </Link>

          <ul className="flex flex-col flex-1 gap-y-3">
            <li className="px-2 py-3 rounded-lg bg-amber-200 hover:bg-amber-100">
              <Link
                to="/dashboard"
                className="grid grid-cols-[auto_1fr] gap-2 items-center text-md"
              >
                <FaBook className="w-6 h-6" />
                <span>Your recipes</span>
              </Link>
            </li>
            <li className="px-2 py-3 rounded-lg bg-amber-200 hover:bg-amber-100">
              <Link
                to="/dashboard/create-recipe"
                className="grid grid-cols-[auto_1fr] gap-2 items-center text-md"
              >
                <FaPlus className="w-6 h-6" />
                <span>Create recipe</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
  )
}

export default DashboardSidebar
