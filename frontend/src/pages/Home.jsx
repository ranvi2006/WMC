import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* TEXT */}
        <div>
          <span
            className="
              inline-block mb-4 px-3 py-1 text-xs font-semibold rounded-full
              bg-blue-100 text-blue-700
              dark:bg-blue-900 dark:text-blue-300
            "
          >
            🚀 Career Growth Platform
          </span>

          <h1
            className="
              text-4xl md:text-5xl font-extrabold leading-tight mb-6
              text-gray-900 dark:text-gray-100
            "
          >
            Master Coding.<br />
            <span
              className="
                bg-clip-text text-transparent
                bg-gradient-to-r from-blue-400 to-indigo-400
              "
            >
              Crack Interviews.
            </span><br />
            Build a Real Career.
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
            One-on-one mentorship, interview preparation, and structured
            learning paths designed to get you job-ready.
          </p>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    text-white font-semibold
                    px-6 py-3 rounded-md
                    shadow-lg shadow-blue-500/30
                    hover:from-blue-500 hover:to-indigo-500
                    hover:shadow-blue-500/50
                    transition-all duration-200
                  "
                >
                  Start Free
                </Link>

                <Link
                  to="/student/book-interview"
                  className="
                    border border-blue-600 text-blue-600
                    dark:border-blue-400 dark:text-blue-400
                    px-6 py-3 rounded-md font-semibold
                    hover:bg-blue-50 dark:hover:bg-blue-900/40
                    transition
                  "
                >
                  Book Interview
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/courses"
                  className="
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    text-white font-semibold
                    px-6 py-3 rounded-md
                    shadow-lg shadow-blue-500/30
                    hover:from-blue-500 hover:to-indigo-500
                    transition
                  "
                >
                  Browse Courses
                </Link>

                <Link
                  to="/dashboard"
                  className="
                    border border-blue-600 text-blue-600
                    dark:border-blue-400 dark:text-blue-400
                    px-6 py-3 rounded-md font-semibold
                    hover:bg-blue-50 dark:hover:bg-blue-900/40
                    transition
                  "
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src="/images/hero-interview.png"
            alt="Coding interview preparation"
            className="max-w-md w-full drop-shadow-xl"
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="font-bold text-lg mb-2">Personal Mentorship</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Guidance from industry professionals.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
            <div className="text-3xl mb-4">💼</div>
            <h3 className="font-bold text-lg mb-2">Interview Practice</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mock interviews with real feedback.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="font-bold text-lg mb-2">Job-Ready Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Skills that companies actually hire for.
            </p>
          </div>

        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Why We Make Coder?
          </h2>

          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✔ Industry mentors</li>
            <li>✔ Practical interview prep</li>
            <li>✔ Career support</li>
            <li>✔ Strong community</li>
          </ul>
        </div>

        <img
          src="/images/career-growth.png"
          alt="Career growth"
          className="max-w-md w-full mx-auto drop-shadow-xl"
        />
      </section>

      {/* ================= CTA ================= */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">
            Start Your Tech Career Today
          </h2>
          <p className="mb-6">
            Learn smarter. Get hired faster.
          </p>
          <Link
            to="/register"
            className="
              bg-white text-blue-700 font-semibold
              px-8 py-3 rounded-md
              shadow-lg
              hover:bg-gray-100
              transition
            "
          >
            Get Started Free
          </Link>
        </section>
      )}
    </div>
  );
}
