import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";


const TeacherNavbar = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  

  /* ================= STATE ================= */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // window.location.href = "/home";
    navigate("/home");
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { name: "My Classes", path: "/instructor/classes" },
    { name: "My Interviews", path: "/teacher/interviews" },
    { name: "Availability", path: "/teacher/availability" },
    { name: "Students", path: "/instructor/students" },
    { name: "Edit Courses", path: "/instructor/courses" },
  ];

  /* ================= RENDER ================= */
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/instructor/dashboard" className="flex items-center gap-3">
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

          {/* CONDUCT INTERVIEW – ALWAYS VISIBLE */}
          <Link
            to="/conduct-interview"
            className="
              bg-gradient-to-r from-blue-600 to-indigo-600
              text-white text-xs font-semibold
              px-3 py-1.5 rounded
              shadow-md shadow-blue-500/30
              hover:from-blue-500 hover:to-indigo-500
              hover:shadow-blue-500/50
              active:scale-95
              transition-all duration-200
            "
          >
            Conduct
          </Link>

          {/* HAMBURGER */}
          <button
            className="sm:hidden flex flex-col gap-1"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menu"
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

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       bg-gray-100 dark:bg-gray-800
                       text-gray-700 dark:text-gray-200
                       hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full bg-blue-800 text-white font-bold"
            >
              AB
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-lg">
                <Link className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" to="/profile">
                  Profile
                </Link>
                <Link className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" to="/settings">
                  Settings
                </Link>
                <Link className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" to="/help">
                  Help
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
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
        <div className="sm:hidden bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 border-t border-gray-300 dark:border-gray-700">
          <ul className="px-4 py-3 space-y-3 text-sm max-h-[70vh] overflow-y-auto">

            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className="block text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            <hr className="border-gray-300 dark:border-gray-700" />

            <button
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              className="block text-left text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            <div className="flex flex-wrap gap-2 items-center text-gray-700 dark:text-gray-200">
              <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
              <span className="opacity-50">|</span>
              <Link to="/settings" onClick={closeMobileMenu}>Settings</Link>
              <span className="opacity-50">|</span>
              <Link to="/help" onClick={closeMobileMenu}>Help</Link>
              <span className="opacity-50">|</span>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>

          </ul>
        </div>
      )}
    </nav>
  );
};

export default TeacherNavbar;
