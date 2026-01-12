import React from "react";

const roadmaps = [
  {
    title: "Web Development",
    accent: "blue",
    steps: [
      "HTML",
      "CSS",
      "JavaScript",
      "Git & GitHub",
      "React",
      "APIs",
      "Node.js",
      "MongoDB",
      "Projects",
      "Mock Interview",
      "Resume",
      "JOB",
    ],
  },
  {
    title: "App Development",
    accent: "emerald",
    steps: [
      "Basics",
      "Dart / JavaScript",
      "Flutter / React Native",
      "UI Design",
      "APIs",
      "Firebase",
      "Deployment",
      "Projects",
      "Mock Interview",
      "JOB",
    ],
  },
  {
    title: "Python / Data Science",
    accent: "purple",
    steps: [
      "Python",
      "Logic",
      "NumPy",
      "Pandas",
      "SQL",
      "Visualization",
      "Mini Projects",
      "Case Studies",
      "Mock Interview",
      "JOB",
    ],
  },
];

const Roadmaps = () => {
  return (
    <section className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Follow Your Road to a Job
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Choose a path. Build skills. Reach your destination.
          </p>
        </header>

        {/* ROADMAP CARDS */}
        <div className="space-y-6 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          {roadmaps.map((road, idx) => (
            <div
              key={idx}
              className="
                rounded-xl border
                bg-white dark:bg-gray-900
                border-gray-200 dark:border-gray-800
                p-5
              "
            >
              {/* TITLE */}
              <h2
                className={`text-lg font-bold text-${road.accent}-600 dark:text-${road.accent}-400`}
              >
                {road.title}
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Step-by-step learning path
              </p>

              {/* MOBILE – STACKED STEPS */}
              <ol className="mt-5 space-y-3 md:hidden">
                {road.steps.map((step, i) => {
                  const isJob = step === "JOB";
                  return (
                    <li
                      key={i}
                      className={`
                        flex items-center justify-between
                        rounded-lg px-4 py-3
                        border
                        ${
                          isJob
                            ? "bg-yellow-50 border-yellow-400 text-yellow-700 font-bold"
                            : "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        }
                      `}
                    >
                      <span className="text-sm">{step}</span>
                      <span className="text-xs text-gray-400">
                        {i + 1}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* DESKTOP – TIMELINE */}
              <div className="hidden md:block mt-6 relative">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />
                <ul className="space-y-4 pl-6">
                  {road.steps.map((step, i) => {
                    const isJob = step === "JOB";
                    return (
                      <li key={i} className="relative">
                        <span
                          className={`
                            absolute -left-6 top-1.5 w-3 h-3 rounded-full
                            ${
                              isJob
                                ? "bg-yellow-400"
                                : `bg-${road.accent}-500`
                            }
                          `}
                        />
                        <span
                          className={`text-sm ${
                            isJob
                              ? "font-bold text-yellow-600"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Roadmaps;
