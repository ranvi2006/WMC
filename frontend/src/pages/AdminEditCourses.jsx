import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/EditCourses.css"; // reuse same CSS

const AdminEditCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch all courses (admin)
  const fetchAllCourses = async () => {
    try {
      const res = await api.get("/api/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Admin fetch courses error:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // 🔴 Delete course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch {
      alert("Failed to delete course");
    }
  };

  // 🔴 Delete roadmap (admin)
  const handleDeleteRoadmap = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this roadmap?")) return;

    try {
      await api.delete(`/api/roadmaps/course/${courseId}`);
      alert("Roadmap deleted successfully");
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete roadmap"
      );
    }
  };

  if (loading) return <p className="container">Loading courses...</p>;
  if (error) return <p className="container error">{error}</p>;

  return (
    <div className="container edit-courses">
      {/* Header */}
      <div className="edit-courses-header">
        <h1>Admin – Manage Courses</h1>

        <Link to="/admin/courses/create" className="btn btn-primary">
          + Add Course
        </Link>
      </div>

      {/* Empty state */}
      {courses.length === 0 ? (
        <div className="edit-courses-empty">
          <p>No courses found.</p>
          <Link to="/admin/courses/create" className="btn btn-primary">
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="edit-courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="edit-course-card">
              <h3>{course.title}</h3>

              <p className="course-description">
                {course.description}
              </p>

              <div className="course-meta">
                <span>
                  <strong>Status:</strong> {course.status}
                </span>
                <span>
                  <strong>Instructor:</strong>{" "}
                  {course.createdBy?.name || "N/A"}
                </span>
              </div>

              {/* 🔹 ACTION BUTTONS */}
              <div className="course-actions">
                {/* View course */}
                <Link
                  to={`/courses/${course._id}`}
                  className="btn btn-outline"
                >
                  View
                </Link>

                {/* Edit course */}
                <Link
                  to={`/admin/courses/edit/${course._id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>

                {/* ✅ UPLOAD / REPLACE ROADMAP */}
                <Link
                  to={`/instructor/courses/${course._id}/roadmap`}
                  className="btn btn-secondary"
                >
                  Upload Roadmap
                </Link>

                {/* 👁 VIEW ROADMAP */}
                <Link
                  to={`/courses/${course._id}/showroadmap`}
                  className="btn btn-outline"
                >
                  View Roadmap
                </Link>

                {/* ❌ DELETE ROADMAP */}
                <button
                  className="btn btn-outline btn-danger"
                  onClick={() => handleDeleteRoadmap(course._id)}
                >
                  Delete Roadmap
                </button>

                {/* ❌ DELETE COURSE */}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCourse(course._id)}
                >
                  Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEditCourses;
