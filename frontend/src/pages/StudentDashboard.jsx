import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../services/enrollmentService";

import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data?.data || []);
      } catch (err) {
        console.error("Enrollment fetch error:", err);
        setError("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) {
    return <p className="container">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="container error">{error}</p>;
  }

  return (
    <div className="container student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="dashboard-subtitle">
          Here are the courses you are currently enrolled in
        </p>
      </header>

      {/* Empty State */}
      {enrollments.length === 0 ? (
        <div className="dashboard-empty">
          <p>You have not enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        /* Courses Grid */
        <div className="dashboard-grid">
          {enrollments.map((item) => (
            <div key={item._id} className="dashboard-card">
              <h3>{item.courseId?.title}</h3>

              <p className="dashboard-description">
                {item.courseId?.description}
              </p>

              <div className="dashboard-meta">
                <span>
                  <strong>Status:</strong> {item.status}
                </span>
              </div>

              <div className="dashboard-actions">
                {/* Roadmap removed */}

                <Link
                  to={`/courses/${item.courseId?._id}`}
                  className="btn btn-primary"
                >
                  Go to Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
