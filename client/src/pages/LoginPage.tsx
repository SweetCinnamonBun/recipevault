import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const demoCredentials = {
    email: "demo@user.com",
    password: "demoPassword123!",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch("/api/login?useCookies=true", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        // Step 2: Fetch user info after successful login
        const userInfoResponse = await fetch("/api/accounts/user-info", {
          credentials: "include", // Include cookies in the request
        });

        if (userInfoResponse.ok) {
          const user = await userInfoResponse.json();

          // Step 3: Set the user info in the Redux store
          dispatch(setUser(user));

          // Step 4: Redirect the user to the home page
          navigate("/");
        } else {
          // Handle user info fetch error
          setErrMsg("Failed to fetch user information");
        }
      } else {
        // Handle login errors
        const errorData = await loginResponse.json();
        if (loginResponse.status === 400) {
          const errors = errorData.errors;
          if (Array.isArray(errors)) {
            setErrMsg(errors.map((error) => `• ${error}`).join("\n"));
          }
        } else if (loginResponse.status === 401) {
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

  const handleDemoLogin = async () => {
    try {
      const loginResponse = await fetch("/api/login?useCookies=true", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demoCredentials),
      });

      if (loginResponse.ok) {
        const userInfoResponse = await fetch("/api/accounts/user-info", {
          credentials: "include",
        });

        if (userInfoResponse.ok) {
          const user = await userInfoResponse.json();
          dispatch(setUser(user));
          navigate("/");
        } else {
          setErrMsg("Failed to fetch user information");
        }
      } else {
        setErrMsg("Demo login failed");
      }
    } catch (err) {
      setErrMsg("Error logging in as demo user");
    }
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <div className="relative w-[450px] rounded-lg bg-white shadow">
        <div className="px-5 pt-5 pb-5">
          <h1 className="pt-4 pb-10 text-3xl font-semibold text-center text-gray-600">
            Login
          </h1>
          <form className="" action="#" onSubmit={handleSubmit}>
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
              Log in
            </button>
          
          </form>
            <button
            onClick={handleDemoLogin}
            className="w-full py-2 mt-4 text-lg font-semibold text-white bg-blue-500 rounded-sm"
          >
            Login as Demo User
          </button>
            <div className="flex justify-center gap-1 mb-3 mt-7">
              <p className="text-sm font-normal text-gray-500">
                Don’t have an account?
              </p>
              <NavLink
                to="/register"
                className="text-sm font-normal text-blue-600 underline"
              >
                Register Account
              </NavLink>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
