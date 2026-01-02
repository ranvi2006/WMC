import React, { useEffect, useState } from "react";
import "../styles/MyCourses.css";

const API_URL = import.meta.env.VITE_API_URL;

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/api/enrollments/my`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        // ❌ Auth / server error
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        console.log("API RESPONSE:", json);

        // ✅ Defensive extraction
        const data = Array.isArray(json?.data) ? json.data : [];
        setCourses(data);

      } catch (err) {
        console.error("Fetch MyCourses Error:", err);
        setError("Failed to load your courses. Please try again.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  /* ================= STATES ================= */

  if (loading) {
    return <div className="courses-loading">Loading your courses…</div>;
  }

  if (error) {
    return <div className="courses-error">{error}</div>;
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="courses-empty">
        <h2>No Courses Yet</h2>
        <p>You haven’t enrolled in any courses.</p>
      </div>
    );
  }

  /* ================= PAGE ================= */

  return (
    <div className="my-courses-page">
      <h1 className="page-title">My Courses</h1>

      <div className="courses-grid">
        {courses.map((item) => (
          <div className="course-card" key={item._id}>
            <div className="course-header">
              <span className="course-level">
                {item.courseId?.level || "Beginner"}
              </span>
              <span className="course-category">
                {item.courseId?.category}
              </span>
            </div>

            <h3 className="course-title">
              {item.courseId?.title}
            </h3>

            <p className="course-description">
              {item.courseId?.description}
            </p>

            <div className="progress-wrapper">
              <div className="progress-info">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="course-footer">
              {/* Roadmap removed */}

              <button className="continue-btn">
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
