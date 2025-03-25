import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerResponse = await fetch(
        "/api/accounts/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );

      if (registerResponse.ok) {
        // Step 2: Fetch user info after successful login
       navigate("/login");

      } else {
        // Handle login errors
        const errorData = await registerResponse.json();
        if (registerResponse.status === 400) {
          const errors = errorData.errors;
          if (Array.isArray(errors)) {
            setErrMsg(errors.map((error) => `• ${error}`).join("\n"));
          }
        } else if (registerResponse.status === 401) {
          setErrMsg("Invalid Credentials");
        } else {
          setErrMsg("Login Failed");
        }
      }
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="relative w-[450px] rounded-lg bg-white shadow">
        <div className="px-5 pt-5 pb-5">
          <h1 className="pt-4 pb-10 text-3xl font-semibold text-center text-gray-600">
            Register
          </h1>
          <form className="" action="#" onSubmit={handleSubmit}>
          <div className="mb-4">
              <label htmlFor="email" className="">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="w-full px-2 py-2 mt-2 border-2 border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="w-full px-2 py-2 mt-2 border-2 border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-2 py-2 mt-2 border-2 border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-2 py-2 mt-2 border-2 border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {errMsg && <p className="text-red-600">{errMsg}</p>}
            <button
              type="submit"
              className="w-full py-2 text-lg font-semibold text-white bg-black rounded-sm"
            >
              Register
            </button>
            <div className="flex justify-center gap-1 mb-3 mt-7">
              <p className="text-sm font-normal text-gray-500">
                Don’t have an account?
              </p>
              <NavLink
                to="/login"
                className="text-sm font-normal text-blue-600 underline"
              >
                Login
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
