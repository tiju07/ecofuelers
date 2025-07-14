// FILE: Navbar.tsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<
    { username: string; role: "admin" | "employee" } | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Only one effect: refetch user on location change, but skip loading if already loaded and path didn't change
  useEffect(() => {
    let ignore = false;
    const fetchUser = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(
        //   "http://127.0.0.1:8000/auth/users/me",
        //   { withCredentials: true }
        // );
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))
          ?.split('=')[1];
        console.log("Token:", token);
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if (token) setUser(decodedToken);
          console.log(decodedToken);
        }

      } catch (err) {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchUser();
    return () => { ignore = true; };
  }, [location.pathname]);

  const handleLogout = async () => {
    // Remove token cookie (works if not httpOnly)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    setLoading(false);

    navigate("/login");
  };

  if (loading) {
    return (
      <nav className="bg-[#2E7D32] text-white px-4 py-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-extrabold text-xl tracking-tight flex items-center animate-pulse">
            Loading...
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#2E7D32] text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo and Dashboard */}
        <div className="flex items-center space-x-6">
          <span className="font-extrabold text-xl tracking-tight flex items-center">
            <svg
              className="w-7 h-7 mr-2 text-[#A5D6A7]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636"
              />
            </svg>
            EcoFuelers
          </span>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
              }`
            }
          >
            Dashboard
          </NavLink>
          {user?.role === "admin" && (
            <>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
                  }`
                }
              >
                Inventory
              </NavLink>
              <NavLink
                to="/recommendations"
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
                  }`
                }
              >
                Recommendations
              </NavLink>
              <NavLink
                to="/alerts"
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
                  }`
                }
              >
                Alerts
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
                  }`
                }
              >
                Reports
              </NavLink>
            </>
          )}
          {user?.role === "employee" && (
            <>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
                  }`
                }
              >
                Inventory
              </NavLink>
              <NavLink
                to="/alerts"
                className={({ isActive }) =>
                  `px-3 py-2 rounded font-semibold ${isActive ? "bg-[#1B5E20]" : "hover:bg-[#1B5E20] transition"
                  }`
                }
              >
                Alerts
              </NavLink>
            </>
          )}
        </div>
        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-3">
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded font-semibold border border-white ${isActive
                    ? "bg-[#1565C0] text-white"
                    : "text-[#1565C0] bg-white hover:bg-[#E3F2FD] transition"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-4 py-2 rounded font-semibold border border-white ${isActive
                    ? "bg-[#00897B] text-white"
                    : "text-[#00897B] bg-white hover:bg-[#E0F2F1] transition"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded font-semibold bg-red-600 hover:bg-red-700 transition border border-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;