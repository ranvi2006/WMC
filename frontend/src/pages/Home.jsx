import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/home.css";

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="container home">
      {/* HERO */}
      <section className="home-hero fade-in">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <span className="home-badge">🚀 Career Growth Platform</span>

            <h1>
              Master Coding. <br />
              Crack Interviews. <br />
              Build a Real Career.
            </h1>

            <p>
              One-on-one mentorship, interview preparation, and structured
              learning paths designed to get you job-ready.
            </p>

            <div className="home-actions">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-cta">
                    Start Free
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/courses" className="btn btn-cta">
                    Browse Courses
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline">
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="home-hero-media">
            <img
              src="/images/hero-interview.png"
              alt="Coding interview preparation"
              className="home-hero-image"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-features">
        <div className="home-feature">
          <div className="home-icon">🎯</div>
          <h3>Personal Mentorship</h3>
          <p>Guidance from industry professionals.</p>
        </div>

        <div className="home-feature">
          <div className="home-icon">💼</div>
          <h3>Interview Practice</h3>
          <p>Mock interviews with real feedback.</p>
        </div>

        <div className="home-feature">
          <div className="home-icon">📚</div>
          <h3>Job-Ready Learning</h3>
          <p>Skills that companies actually hire for.</p>
        </div>
      </section>

      {/* WHY */}
      <section className="home-why card">
        <div>
          <h2>Why We Make Coder?</h2>
          <ul className="home-list">
            <li>Industry mentors</li>
            <li>Practical interview prep</li>
            <li>Career support</li>
            <li>Strong community</li>
          </ul>
        </div>

        <img
          src="/images/career-growth.png"
          alt="Career growth"
          className="home-why-image"
        />
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="home-cta">
          <h2>Start Your Tech Career Today</h2>
          <p>Learn smarter. Get hired faster.</p>
          <Link to="/register" className="btn btn-cta btn-lg">
            Get Started Free
          </Link>
        </section>
      )}
    </div>
  );
}
    