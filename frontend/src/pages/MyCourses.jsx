import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/api/enrollments/my`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        const data = Array.isArray(json?.data)
          ? json.data
          : [];

        setCourses(data);
      } catch (err) {
        console.error("Fetch MyCourses Error:", err);
        setError(
          "Failed to load your courses. Please try again."
        );
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading your courses…
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

  /* ================= EMPTY ================= */
  if (!courses || courses.length === 0) {
    return (
      <div
        className="
          min-h-screen flex flex-col items-center justify-center
          bg-gray-50
          dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
          px-4
        "
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Courses Yet
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You haven’t enrolled in any courses.
        </p>
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

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          My Courses
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((item) => (
            <div
              key={item._id}
              className="
                rounded-2xl p-5
                bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
                border border-gray-200 dark:border-white/10
                shadow-lg
                flex flex-col
              "
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {item.courseId?.level || "Beginner"}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {item.courseId?.category}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.courseId?.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {item.courseId?.description}
              </p>

              {/* PROGRESS */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* ACTION */}
              <button
                className="
                  mt-auto px-4 py-2 rounded-xl
                  bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white text-sm font-semibold
                  shadow-md shadow-purple-600/30
                  hover:opacity-90 transition
                "
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
