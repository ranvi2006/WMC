// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  function handleLogout() {
    dispatch(logout());
    navigate('/home');
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/images/CompanyLogo.jpg" alt="We Make Coder" className="logo-img" />
          <span className="logo-text">We Make Coder</span>
        </div>

        <button className="hamburger" onClick={toggleMobileMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <ul className={`navbar-menu ${isMobileOpen ? 'active' : ''}`}>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/courses" className="nav-link">Courses</Link></li>
          <li><Link to="/roadmaps" className="nav-link">Roadmaps</Link></li>
          <li><Link to="/docs" className="nav-link">Documentation</Link></li>
          <li className="nav-cta">
            <Link to="/login" className="cta-button">Login</Link>
          </li>
        </ul>
      </div>

      <div className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
    </nav>
  );
};

export default Navbar;
