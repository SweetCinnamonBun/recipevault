import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/authSlice";

const ProfileDropdown = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

const logout = async () => {
  try {
    await fetch("/api/accounts/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/all-recipes"); // move first
    dispatch(setUser(null));  // then clear auth state
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      <Menu>
        <MenuButton className="flex items-center gap-2">
          <FaUserCircle size={34} className="text-gray-600" />
          <span className="font-medium text-gray-700">
            {user?.profileName ?? "Guest"}
          </span>
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          className="w-48 p-1 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl"
        >
          <MenuItem>
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left rounded-lg data-[focus]:bg-gray-100"
            >
              Logout
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
};

export default ProfileDropdown;
