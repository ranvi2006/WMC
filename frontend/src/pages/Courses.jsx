import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../services/courseService";

import "../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res.data.data);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="container">Loading courses...</p>;
  if (error) return <p className="container error">{error}</p>;

  return (
    <div className="container courses-page">
      <header className="courses-header">
        <h1>All Courses</h1>
        <p className="courses-subtitle">
          Explore our curated courses designed for real-world skills
        </p>
      </header>

      {courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>

              <p className="course-description">
                {course.description}
              </p>

              <p className="course-level">
                <strong>Level:</strong> {course.level}
              </p>

              <Link
                to={`/courses/${course._id}`}
                className="btn btn-outline course-btn"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
