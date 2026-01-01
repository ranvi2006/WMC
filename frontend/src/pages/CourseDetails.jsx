import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { getCourseById } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";

import "../styles/CourseDetails.css";

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data.data);
      } catch {
        setMessage("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) return setMessage("Please login as student to enroll");
    if (user?.role != "STUDENT") return setMessage("Only students can enroll");

    try {
      setEnrolling(true);
      await enrollInCourse(course._id);
      setMessage("Enrolled successfully 🎉");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p className="container">Loading...</p>;
  if (!course) return <p className="container">Course not found</p>;

  return (
    <div className="container course-details">
      <div className="course-card">
        <header className="course-header">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
        </header>

        <div className="course-meta">
          <div><strong>Category:</strong> {course.category}</div>
          <div><strong>Level:</strong> {course.level}</div>
          <div><strong>Instructor:</strong> {course.createdBy?.name}</div>
        </div>

        {course.roadmap && (
          <div className="course-roadmap">
            <a
              href={course.roadmap.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              View Roadmap (PDF)
            </a>
          </div>
        )}

        <div className="course-actions">
          <button
            className="btn btn-primary"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll in Course"}
          </button>
        </div>

        {message && (
          <p
            className={`course-message ${
              message.includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
