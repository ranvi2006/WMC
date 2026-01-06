import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function EditCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/api/courses/my");
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  /* ================= DELETE ROADMAP ================= */
  const handleDeleteRoadmap = async (courseId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this roadmap?"
      )
    )
      return;

    try {
      await api.delete(`/api/roadmaps/course/${courseId}`);
      alert("Roadmap deleted successfully");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete roadmap"
      );
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading courses…
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="py-16 text-center text-sm text-red-600 dark:text-red-400">
        {error}
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
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Courses
          </h1>

          <Link
            to="/instructor/courses/create"
            className="
              px-5 py-2 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white shadow-lg shadow-purple-600/30
              hover:opacity-90 transition
            "
          >
            + Create Course
          </Link>
        </div>

        {/* EMPTY STATE */}
        {courses.length === 0 ? (
          <div
            className="
              max-w-md mx-auto text-center
              bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
              border border-gray-200 dark:border-white/10
              rounded-2xl p-6 shadow-lg
            "
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have not created any courses yet.
            </p>
            <Link
              to="/instructor/courses/create"
              className="
                px-6 py-2 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
              "
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="
                  rounded-2xl p-5
                  bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
                  border border-gray-200 dark:border-white/10
                  shadow-lg
                  flex flex-col
                "
              >
                {/* TITLE */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {course.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* META */}
                <div className="text-xs text-gray-700 dark:text-gray-300 flex justify-between mb-4">
                  <span>
                    <strong>Status:</strong> {course.status}
                  </span>
                  <span>
                    <strong>Enrollments:</strong>{" "}
                    {course.totalEnrollments || 0}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-auto flex flex-wrap gap-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="
                      px-3 py-1.5 rounded-xl text-xs
                      bg-gray-200 dark:bg-gray-700
                      text-gray-800 dark:text-gray-200
                      hover:opacity-80 transition
                    "
                  >
                    View
                  </Link>

                  <Link
                    to={`/instructor/courses/edit/${course._id}`}
                    className="
                      px-3 py-1.5 rounded-xl text-xs
                      bg-indigo-600 text-white
                      hover:bg-indigo-500 transition
                    "
                  >
                    Edit
                  </Link>

                  <Link
                    to={`/instructor/courses/${course._id}/roadmap`}
                    className="
                      px-3 py-1.5 rounded-xl text-xs
                      bg-purple-600 text-white
                      hover:bg-purple-500 transition
                    "
                  >
                    Upload Roadmap
                  </Link>

                  <Link
                    to={`/courses/${course._id}/showroadmap`}
                    className="
                      px-3 py-1.5 rounded-xl text-xs
                      bg-gray-200 dark:bg-gray-700
                      text-gray-800 dark:text-gray-200
                      hover:opacity-80 transition
                    "
                  >
                    View Roadmap
                  </Link>

                  {/* OPTIONAL DELETE */}
                  {/*
                  <button
                    onClick={() =>
                      handleDeleteRoadmap(course._id)
                    }
                    className="
                      px-3 py-1.5 rounded-xl text-xs
                      bg-red-600 text-white
                      hover:bg-red-500 transition
                    "
                  >
                    Delete Roadmap
                  </button>
                  */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
