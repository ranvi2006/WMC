import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "./AdminNavbar.css";

const AdminNavbar = () => {
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

    // 2️⃣ Remove token (if not already done in slice)
    localStorage.removeItem("token");

    // 3️⃣ Redirect to home (replace history)
    navigate("/home", { replace: true });
  };

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    <nav className="admin-navbar">
      <div className="admin-navbar-container">

        {/* Logo */}
        <Link to="/admin/dashboard" className="admin-navbar-logo">
          <img
            src="/images/CompanyLogo.jpg"
            alt="We Make Coder"
            className="logo-img"
          />
          <span className="logo-text">We Make Coder</span>
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${isMobileOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Menu */}
        <ul className={`admin-navbar-menu ${isMobileOpen ? "active" : ""}`}>
          <li>
            <Link to="/admin/dashboard" className="nav-link" onClick={toggleMobileMenu}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="nav-link" onClick={toggleMobileMenu}>
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/courses" className="nav-link" onClick={toggleMobileMenu}>
              Courses
            </Link>
          </li>
          <li>
            <Link to="/admin/interviews" className="nav-link" onClick={toggleMobileMenu}>
              Interviews
            </Link>
          </li>
          <li>
            <Link to="/admin/analytics" className="nav-link" onClick={toggleMobileMenu}>
              Platform Analytics
            </Link>
          </li>

          <li className="nav-cta">
            <Link
              to="/admin/monitoring"
              className="cta-button admin-cta"
              onClick={toggleMobileMenu}
            >
              System Monitoring
            </Link>
          </li>
        </ul>

        {/* Profile */}
        <div className="profile-section" ref={dropdownRef}>
          <button
            className="profile-avatar"
            onClick={toggleDropdown}
            type="button"
            aria-label="Admin menu"
          >
            <span className="avatar-placeholder">SA</span>
          </button>

          <div className={`profile-dropdown ${isDropdownOpen ? "show" : ""}`}>
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <Link to="/help" className="dropdown-item">Help</Link>

            {/* Logout */}
            <button
              className="dropdown-item logout"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      />
    </nav>
  );
};

export default AdminNavbar;
