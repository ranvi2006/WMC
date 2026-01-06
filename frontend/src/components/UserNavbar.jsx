import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  /* ================= THEME ================= */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= USER INITIALS ================= */
  const userInitials = useMemo(() => {
    if (!user?.name) return "U";
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }, [user?.name]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // window.location.href = "/home";
    navigate("/home");
  };

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "Courses", path: "/courses" },
    { name: "My Interviews", path: "/student/interviews" },
    { name: "Documentation", path: "/docs" },
  ];

  /* ================= RENDER ================= */
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-3">
          <img
            src="/images/CompanyLogo.png"
            alt="We Make Coder"
            className="w-9 h-9 rounded-lg"
          />
          <span className="hidden sm:block font-bold text-blue-900 dark:text-white">
            We Make Coder
          </span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* BOOK INTERVIEW */}
          <Link
            to="/student/book-interview"
            className="
              bg-gradient-to-r from-blue-600 to-indigo-600
              text-white text-xs font-semibold
              px-3 py-1.5 rounded
              shadow-md shadow-blue-500/30
              hover:from-blue-500 hover:to-indigo-500
              transition
            "
          >
            Book Interview ₹9
          </Link>

          {/* HAMBURGER */}
          <button
            className="sm:hidden flex flex-col gap-1"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
            <span className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
            <span className="w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
          </button>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden sm:flex items-center gap-6">
          {navLinks.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="
              w-9 h-9 rounded-full flex items-center justify-center
              bg-gray-100 dark:bg-gray-800
              text-gray-700 dark:text-gray-200
            "
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="
                w-9 h-9 rounded-full
                bg-blue-800 text-white font-bold
                flex items-center justify-center
                hover:bg-blue-700
              "
            >
              {userInitials}
            </button>

            {isProfileOpen && (
              <div
                className="
                  absolute right-0 mt-2 w-44
                  bg-white dark:bg-gray-800
                  rounded-lg shadow-lg
                  border border-gray-200 dark:border-gray-700
                  z-50
                "
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/course/my-courses"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  My Courses
                </Link>

                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    w-full text-left px-4 py-2 text-sm
                    text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700
                  "
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </ul>
      </div>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <ul className="px-4 py-3 space-y-3 text-sm">
            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-gray-800 dark:text-gray-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            <hr className="border-gray-300 dark:border-gray-700" />

            <button
              onClick={toggleTheme}
              className="block text-left text-gray-700 dark:text-gray-200"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold"
            >
              Logout
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
