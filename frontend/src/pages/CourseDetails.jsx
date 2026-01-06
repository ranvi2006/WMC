import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { getCourseById } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";

export default function CourseDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH ================= */
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

  /* ================= ENROLL ================= */
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      return setMessage(
        "Please login as student to enroll"
      );
    }

    if (user?.role !== "student") {
      return setMessage("Only students can enroll");
    }

    try {
      setEnrolling(true);
      await enrollInCourse(course._id);
      setMessage("Enrolled successfully 🎉");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Enrollment failed"
      );
    } finally {
      setEnrolling(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading course…
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!course) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Course not found
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      "
    >
      <div className="max-w-3xl mx-auto">

        {/* CARD */}
        <div
          className="
            rounded-2xl p-6
            bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
            border border-gray-200 dark:border-white/10
            shadow-lg
          "
        >
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {course.description}
            </p>
          </div>

          {/* META */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
            <div>
              <span className="font-semibold">Category:</span>{" "}
              {course.category}
            </div>
            <div>
              <span className="font-semibold">Level:</span>{" "}
              {course.level}
            </div>
            <div>
              <span className="font-semibold">Instructor:</span>{" "}
              {course.createdBy?.name}
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white text-sm font-semibold
              shadow-lg shadow-purple-600/30
              hover:opacity-90 transition
              disabled:opacity-50
            "
          >
            {enrolling ? "Enrolling..." : "Enroll in Course"}
          </button>

          {/* MESSAGE */}
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.toLowerCase().includes("success")
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
