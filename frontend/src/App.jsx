import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import Courses from "./pages/Courses";
import InstructorDashboard from "./pages/InstructorDashboard";
import { useSelector } from "react-redux";
import UserNavbar from "./components/UserNavbar";
import TeacherNavbar from "./components/TeacherNavbar";
import AdminNavbar from "./components/AdminNavbar";
import MyCourses from "./pages/MyCourses";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // console.log(isAuthenticated, user);
  return (
    <Router>
      {/* <Navbar /> */}
      {
        !isAuthenticated ? (
          <Navbar />
        ) : user?.role === "STUDENT" ? (
          <UserNavbar />
        ) : user?.role === "TEACHER" ? (
          <TeacherNavbar />
        ) : user?.role === "ADMIN" ? (
          <AdminNavbar />
        ) : null
      }

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Course details (public view, student enroll inside) */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/course/my-courses" element={<MyCourses/>} />
        

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Future protected routes */}
        {/*
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        */}
      </Routes>
    </Router>
  );
}

export default App;
