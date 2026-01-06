import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";


const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  /* ================= THEME ================= */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : "light");

  const closeMobileMenu = () => setIsMobileOpen(false);

  function handleLogout() {
    dispatch(logout());
    navigate("/home");
  }

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Roadmaps", path: "/roadmaps" },
    { name: "Documentation", path: "/docs" },
  ];

  /* ================= RENDER ================= */
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/CompanyLogo.png"
            alt="We Make Coder"
            className="w-9 h-9 rounded-lg"
          />
          <span className="font-semibold text-blue-900 dark:text-white">
            We Make Coder
          </span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* LOGIN – PREMIUM CTA */}
          <Link
            to="/login"
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
            Login
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
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
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
                  onClick={closeMobileMenu}
                  className="block text-gray-800 dark:text-gray-200"
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
              className="block text-left text-gray-700 dark:text-gray-200"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="block font-semibold text-blue-700 dark:text-blue-400"
            >
              Login
            </Link>

          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
