import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../services/courseService";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res.data.data || []);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Courses
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Explore our curated courses designed for real-world skills
          </p>
        </div>

        {/* EMPTY */}
        {courses.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No courses available yet.
          </p>
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
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Level:</strong> {course.level}
                </p>

                {/* ACTIONS */}
                <div className="mt-auto flex gap-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="
                      px-4 py-2 rounded-xl text-xs font-semibold
                      bg-gray-200 dark:bg-gray-700
                      text-gray-800 dark:text-gray-200
                      hover:opacity-80 transition
                    "
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/courses/${course._id}/showroadmap`}
                    className="
                      px-4 py-2 rounded-xl text-xs font-semibold
                      bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white
                      shadow-md shadow-purple-600/30
                      hover:opacity-90 transition
                    "
                  >
                    View Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
