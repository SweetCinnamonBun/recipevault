

import { useUsers } from "@/lib/hooks/useUsers";
import React, { useState } from "react";

const DashboardProfilePage = () => {

  const {currentUser} = useUsers();
    
  const [formData, setFormData] = useState({
    profileName: "John Doe",
    email: "john@example.com",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  
    console.log("Updated profile:", formData);
  };

  return (
    <div className="max-w-4xl px-6 py-8 mx-auto">
      <div className="p-8 bg-white shadow-sm rounded-2xl">
        <h1 className="mb-8 text-3xl font-bold">Profile Settings</h1>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="profileName"
              className="block mb-2 text-sm font-medium"
            >
              Profile Name
            </label>
            <input
              id="profileName"
              name="profileName"
              value={currentUser.profileName}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={currentUser.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 font-medium text-white bg-black rounded-lg hover:bg-gray-400"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardProfilePage;