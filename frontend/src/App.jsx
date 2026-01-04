import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

/* =======================
   NAVBARS
======================= */
import Navbar from "./components/Navbar";
import UserNavbar from "./components/UserNavbar";
import TeacherNavbar from "./components/TeacherNavbar";
import AdminNavbar from "./components/AdminNavbar";

/* =======================
   AUTH & COMMON PAGES
======================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import ViewRoadmap from "./pages/ViewRoadmap";

/* =======================
   STUDENT PAGES
======================= */
import StudentDashboard from "./pages/StudentDashboard";
import MyCourses from "./pages/MyCourses";
import BookInterview from "./pages/student/BookInterview";
import MyInterviews from "./pages/student/MyInterviews";
import ShowFeedback from "./pages/student/ShowFeedback";
import Reschedule from "./pages/student/Reschedule";

/* =======================
   TEACHER PAGES
======================= */
import InstructorDashboard from "./pages/InstructorDashboard";
import EditCourses from "./pages/EditCourses";
import CreateCourse from "./pages/CreateCourse";
import EditSingleCourse from "./pages/EditSingleCourse";
import UploadRoadmap from "./pages/UploadRoadmap";
import Availability from "./pages/teacher/Availability";
import TeacherInterviews from "./pages/teacher/TeacherInterviews";
import Feedback from "./pages/teacher/Feedback";
import RescheduleRequests from "./pages/teacher/RescheduleRequests";


/* =======================
   ADMIN PAGES
======================= */
import AdminEditCourses from "./pages/AdminEditCourses";
import AdminSingleEditCourse from "./pages/AdminSingleEditCourse";
import AdminCreateCourse from "./pages/AdminCreateCourse";
import AdminInterviews from "./pages/admin/AdminInterviews";

/* =======================
   PROTECTED ROUTE
======================= */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>

      {/* =======================
         ROLE BASED NAVBAR
      ======================= */}
      {!user ? (
        <Navbar />
      ) : user.role === "student" ? (
        <UserNavbar />
      ) : user.role === "teacher" ? (
        <TeacherNavbar />
      ) : user.role === "admin" ? (
        <AdminNavbar />
      ) : null}

      <Routes>

        {/* =======================
           PUBLIC ROUTES
        ======================= */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/courses/:courseId/showroadmap" element={<ViewRoadmap />} />

        {/* =======================
           STUDENT ROUTES
        ======================= */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/my-courses"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/book-interview"
          element={
            <ProtectedRoute roles={["student"]}>
              <BookInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/interviews"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyInterviews />
            </ProtectedRoute>
          }
        />
         <Route
          path="/student/feedback/:interviewId"
          element={
            <ProtectedRoute role="student">
              <ShowFeedback />
            </ProtectedRoute>
          }
        />
         <Route
          path="/student/:id/reschedule"
          element={
            <ProtectedRoute role="student">
              <Reschedule/>
            </ProtectedRoute>
          }
        />

        

        {/* =======================
           TEACHER ROUTES
        ======================= */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <EditCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/create"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/edit/:courseId"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <EditSingleCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/courses/:courseId/roadmap"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <UploadRoadmap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/availability"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <Availability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/interviews"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherInterviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/feedback/:interviewId"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/reschedule-requests"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <RescheduleRequests />
            </ProtectedRoute>
          }
        />
        

        {/* =======================
           ADMIN ROUTES
        ======================= */}
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminEditCourses />
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
          path="/admin/courses/edit/:courseId"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminSingleEditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interviews"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminInterviews />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
