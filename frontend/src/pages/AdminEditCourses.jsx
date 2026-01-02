import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/EditCourses.css"; // reuse same CSS

const AdminEditCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/api/courses/${courseId}`);
      console.log("Course deleted:", res);
      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      alert("Failed to delete course");
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

              <div className="course-actions">
                <Link
                  to={`/courses/${course._id}`}
                  className="btn btn-outline"
                >
                  View
                </Link>

                <Link
                ///instructor/courses/edit/:courseId
                  to={`/admin/courses/edit/${course._id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
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
