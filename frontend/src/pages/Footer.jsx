export default function Footer() {
    return (
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-10">
  
          {/* TOP SECTION */}
          <div className="grid gap-8 md:grid-cols-3">
  
            {/* BRAND */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                We Make Coder
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                A learning & mentorship platform focused on real-world skills,
                interviews, and long-term career growth.
              </p>
            </div>
  
            {/* FOUNDERS */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Founders
              </h4>
  
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Founder:&nbsp;
                <a
                  href="https://www.linkedin.com/in/raju-fullstack/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Raju Kumar Mandal
                </a>
              </p>
  
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Co-Founder:&nbsp;
                <a
                  href="https://www.linkedin.com/in/ritik-yadav-ds/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ritik Yadav
                </a>
              </p>
            </div>
  
            {/* COPYRIGHT */}
            <div className="md:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} We Make Coder
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                All rights reserved.
              </p>
            </div>
  
          </div>
  
          {/* BOTTOM LINE */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Built with ❤️ for learners & developers
            </p>
          </div>
  
        </div>
      </footer>
    );
  }
  