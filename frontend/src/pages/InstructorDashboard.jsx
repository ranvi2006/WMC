import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";

import "../styles/InstructorDashboard.css";

const InstructorDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/api/courses/my");
        setCourses(res.data.data);
      } catch {
        setError("Failed to load instructor courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) return <p className="container">Loading dashboard...</p>;
  if (error) return <p className="container error">{error}</p>;

  return (
    <div className="container instructor-dashboard">
      <header className="instructor-header">
        <h1>Instructor Dashboard</h1>
        <p className="instructor-subtitle">
          Welcome, {user?.name}. Manage your courses here.
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="instructor-empty">
          <p>You have not created any courses yet.</p>
          <Link to="/courses/create" className="btn btn-primary">
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="instructor-grid">
          {courses.map((course) => (
            <div key={course._id} className="instructor-card">
              <h3>{course.title}</h3>

              <p className="instructor-description">
                {course.description}
              </p>

              <div className="instructor-meta">
                <span>
                  <strong>Status:</strong> {course.status}
                </span>
                <span>
                  <strong>Enrollments:</strong>{" "}
                  {course.totalEnrollments || 0}
                </span>
              </div>

              <div className="instructor-actions">
                <Link
                  to={`/courses/${course._id}`}
                  className="btn btn-outline"
                >
                  View Course
                </Link>

                {/* Roadmap removed */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
