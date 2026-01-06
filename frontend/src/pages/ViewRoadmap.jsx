import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function ViewRoadmap() {
  const user = JSON.parse(localStorage.getItem("user"));

  let navigatePath = "/";
  if (user?.role === "admin") navigatePath = "/admin/courses";
  else if (user?.role === "teacher") navigatePath = "/instructor/courses";
  else if (user?.role === "student") navigatePath = "/courses";

  const { courseId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.get(
          `/api/roadmaps/course/${courseId}`
        );
        setRoadmap(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No roadmap available"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [courseId]);

  /* ================= LOADING ================= */
  if (loading) {
    return <SkeletonLoader />;
  }

  /* ================= ERROR ================= */
  if (error) {
    return <ErrorState message={error} />;
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
        <div className="mb-6">
          <Link
            to={navigatePath}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Courses
          </Link>

          <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {roadmap.title}
          </h1>
          {roadmap.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {roadmap.description}
            </p>
          )}
        </div>

        {/* CARD */}
        <div
          className="
            rounded-2xl overflow-hidden
            bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
            border border-gray-200 dark:border-white/10
            shadow-lg
          "
        >
          {/* PDF */}
          <div className="aspect-[3/4] w-full">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                roadmap.pdfUrl
              )}&embedded=true`}
              title="Roadmap Preview"
              className="w-full h-full"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 p-4 border-t border-gray-200 dark:border-white/10">
            <a
              href={roadmap.pdfUrl}
              download
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white shadow-md shadow-purple-600/30
                hover:opacity-90 transition
              "
            >
              📥 Download PDF
            </a>

            <a
              href={roadmap.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-gray-200 dark:bg-gray-700
                text-gray-800 dark:text-gray-200
                hover:opacity-80 transition
              "
            >
              🔗 Open Full Size
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SKELETON ================= */
const SkeletonLoader = () => (
  <div
    className="
      min-h-screen px-4 py-10
      bg-gray-50
      dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
    "
  >
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
      <div className="h-8 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-6" />
      <div className="h-[70vh] bg-gray-300 dark:bg-gray-700 rounded-2xl" />
    </div>
  </div>
);

/* ================= ERROR ================= */
const ErrorState = ({ message }) => (
  <div
    className="
      min-h-screen flex flex-col items-center justify-center
      bg-gray-50
      dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      px-4 text-center
    "
  >
    <div
      className="
        rounded-2xl p-6
        bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
        border border-gray-200 dark:border-white/10
        shadow-lg
      "
    >
      <div className="text-4xl mb-3">📄</div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Roadmap Not Available
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {message}
      </p>
      <Link
        to="/courses"
        className="
          px-5 py-2 rounded-xl text-sm font-semibold
          bg-gradient-to-r from-purple-600 to-indigo-600
          text-white shadow-md shadow-purple-600/30
          hover:opacity-90 transition
        "
      >
        Browse Courses
      </Link>
    </div>
  </div>
);
