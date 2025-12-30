import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./css/Navbar.css"

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get user from Redux OR localStorage (FIX)
  const reduxUser = useSelector((state) => state.auth?.user);
  const user = reduxUser || JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [openProfile, setOpenProfile] = useState(false);

  const isLoginPage = location.pathname === "/login";

  const handleAuthRedirect = () => {
    navigate(isLoginPage ? "/register" : "/login");
  };

  // ✅ Proper logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // window.location.href = "/login";
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT */}
        <div className="nav-left">
          <img
            src="/images/logo.jpg"
            alt="logo"
            className="nav-logo"
            onClick={() => navigate("/")}
          />

          {!user && (
            <>
              <Link to="/">Home</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/counselling">Counselling</Link>
            </>
          )}

          {role === "STUDENT" && (
            <>
              <Link to="/courses">Courses</Link>
              <Link to="/my-learning">My Learning</Link>
              <Link to="/interviews">Interviews</Link>
            </>
          )}

          {role === "INSTRUCTOR" && (
            <>
              <Link to="/instructor/dashboard">Dashboard</Link>
              <Link to="/instructor/courses">My Courses</Link>
            </>
          )}

          {role === "ADMIN" && (
            <Link to="/admin/dashboard">Admin</Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          {!user ? (
            <button className="btn" onClick={handleAuthRedirect}>
              {isLoginPage ? "Register" : "Login"}
            </button>
          ) : (
            <div
              className="profile-circle"
              onClick={() => setOpenProfile(true)}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
      </nav>

      {/* ===== PROFILE SLIDER ===== */}
      {openProfile && user && (
        <div className="profile-overlay" onClick={() => setOpenProfile(false)}>
          <div
            className="profile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{user.name}</h3>
            <p className="role">{role}</p>

            <hr />

            <Link to="/profile" onClick={() => setOpenProfile(false)}>
              My Profile
            </Link>

            {role === "STUDENT" && (
              <>
                <Link to="/my-learning" onClick={() => setOpenProfile(false)}>
                  My Courses
                </Link>
                <Link to="/interviews" onClick={() => setOpenProfile(false)}>
                  Interviews
                </Link>
              </>
            )}

            {role === "INSTRUCTOR" && (
              <>
                <Link
                  to="/instructor/dashboard"
                  onClick={() => setOpenProfile(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/instructor/create-course"
                  onClick={() => setOpenProfile(false)}
                >
                  Create Course
                </Link>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <Link to="/admin/users" onClick={() => setOpenProfile(false)}>
                  Users
                </Link>
                <Link
                  to="/admin/instructors"
                  onClick={() => setOpenProfile(false)}
                >
                  Instructors
                </Link>
                <Link to="/admin/reports" onClick={() => setOpenProfile(false)}>
                  Reports
                </Link>
              </>
            )}

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
