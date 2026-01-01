import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "./TeacherNavbar.css";

const TeacherNavbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= HANDLERS ================= */

  const toggleMobileMenu = () => {
    setIsMobileOpen(prev => !prev);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    // 1️⃣ Clear redux auth state
    dispatch(logout());

    // 2️⃣ Remove token (safety)
    localStorage.removeItem("token");

    // 3️⃣ Redirect to home (replace history)
    navigate("/home", { replace: true });
  };

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= RENDER ================= */

  return (
    <nav className="teacher-navbar">
      <div className="teacher-navbar-container">

        {/* Logo */}
        <Link to="/instructor/dashboard" className="teacher-navbar-logo">
          <img
            src="/images/CompanyLogo.jpg"
            alt="We Make Coder"
            className="logo-img"
          />
          <span>We Make Coder</span>
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${isMobileOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Menu */}
        <ul className={`teacher-navbar-menu ${isMobileOpen ? "active" : ""}`}>
          <li>
            <Link
              className="nav-link"
              to="/instructor/classes"
              onClick={toggleMobileMenu}
            >
              My Classes
            </Link>
          </li>

          <li>
            <Link
              className="nav-link"
              to="/instructor/meetings"
              onClick={toggleMobileMenu}
            >
              My Meetings
            </Link>
          </li>

          <li>
            <Link
              className="nav-link"
              to="/instructor/students"
              onClick={toggleMobileMenu}
            >
              Students
            </Link>
          </li>

          <li>
            <Link
              className="nav-link"
              to="/instructor/courses"
              onClick={toggleMobileMenu}
            >
              Edit Courses
            </Link>
          </li>

          <li className="nav-cta">
            <Link
              to="/conduct-interview"
              className="cta-button instructor-cta"
              onClick={toggleMobileMenu}
            >
              Conduct Interview
            </Link>
          </li>

          {/* Profile */}
          <li className="profile-section" ref={dropdownRef}>
            <button
              className="profile-avatar"
              onClick={toggleDropdown}
              type="button"
              aria-label="Profile menu"
            >
              AB
            </button>

            <div className={`profile-dropdown ${isDropdownOpen ? "show" : ""}`}>
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
                Settings
              </Link>
              <Link to="/help" className="dropdown-item">
                Help
              </Link>

              {/* Logout */}
              <button
                className="dropdown-item logout"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      <div
        className={`mobile-overlay ${isMobileOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      />
    </nav>
  );
};

export default TeacherNavbar;
