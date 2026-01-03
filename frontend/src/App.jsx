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
import CreateCourse from "./pages/CreateCourse";
import EditCourses from "./pages/EditCourses";
import UploadRoadmap from "./pages/UploadRoadmap";
import EditSingleCourse from "./pages/EditSingleCourse";
import AdminEditCourses from "./pages/AdminEditCourses";
import AdminSingleEditCourse from "./pages/AdminSingleEditCourse";
import AdminCreateCourse from "./pages/AdminCreateCourse";
import ViewRoadmap from "./pages/ViewRoadmap";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(isAuthenticated, user);
  return (
    <Router>
      {/* <Navbar /> */}
      {
        !isAuthenticated ? (
          <Navbar />
        ) : user?.role === "student" ? (
          <UserNavbar />
        ) : user?.role === "teacher" ? (
          <TeacherNavbar />
        ) : user?.role === "admin" ? (
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
        <Route path="/course/my-courses" element={<MyCourses />} />



        <Route
          path="/student/dashboard"
          element={<StudentDashboard />} />



        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute>
              <EditCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:courseId/roadmap"
          element={
            <ProtectedRoute>
              <UploadRoadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/showroadmap"
          element={<ViewRoadmap />}
        />

        <Route
          path="/instructor/courses/create"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/create"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminCreateCourse />
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
        <Route
          path="/instructor/courses/edit/:courseId"
          element={
            <ProtectedRoute>
              <EditSingleCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/edit/:courseId"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminSingleEditCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminEditCourses />
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
