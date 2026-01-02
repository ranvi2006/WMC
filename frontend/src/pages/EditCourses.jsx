import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/EditCourses.css";

const EditCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/api/courses/my");
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error("Fetch courses error:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return <p className="container">Loading courses...</p>;
  }

  if (error) {
    return <p className="container error">{error}</p>;
  }

  return (
    <div className="container edit-courses">
      {/* Header */}
      <div className="edit-courses-header">
        <h1>Edit Courses</h1>

        <Link
          to="/instructor/courses/create"
          className="btn btn-primary"
        >
          + Create Course
        </Link>
      </div>

      {/* Empty State */}
      {courses.length === 0 ? (
        <div className="edit-courses-empty">
          <p>You have not created any courses yet.</p>
          <Link
            to="/instructor/courses/create"
            className="btn btn-primary"
          >
            Create Your First Course
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
                  <strong>Enrollments:</strong>{" "}
                  {course.totalEnrollments || 0}
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
                  to={`/instructor/courses/edit/${course._id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this course?')) {
                      try {
                        await api.delete(`/api/courses/${course._id}`);
                        setCourses(courses.filter(c => c._id !== course._id));
                      } catch (err) {
                        alert('Failed to delete course');
                      }
                    }
                  }}
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

export default EditCourses;
