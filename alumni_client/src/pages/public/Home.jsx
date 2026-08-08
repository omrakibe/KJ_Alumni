import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-container">

          <Link to="/" className="logo">
            KJCOEMR Alumni
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/stories">Success Stories</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>

        </div>
      </nav>


      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">

          <div className="hero-text">
            <p className="hero-label">
              KJCOEMR Alumni Association
            </p>

            <h1>
              Connecting Alumni,
              <span> Celebrating Success.</span>
            </h1>

            <p className="hero-description">
              A connected community of KJCOEMR alumni,
              building relationships, sharing achievements
              and creating opportunities for the future.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">
                Join Alumni Network
              </Link>

              <Link to="/login" className="secondary-btn">
                Alumni Login
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* Statistics */}
      <section className="statistics">
        <div className="container statistics-grid">

          <div className="stat-card">
            <h2>12,500+</h2>
            <p>Verified Alumni</p>
          </div>

          <div className="stat-card">
            <h2>850+</h2>
            <p>Companies</p>
          </div>

          <div className="stat-card">
            <h2>35+</h2>
            <p>Countries</p>
          </div>

          <div className="stat-card">
            <h2>46+</h2>
            <p>Success Stories</p>
          </div>

        </div>
      </section>


      {/* About */}
      <section className="about">
        <div className="container about-content">

          <div>
            <p className="section-label">
              ABOUT US
            </p>

            <h2>
              Building a stronger alumni community
            </h2>
          </div>

          <p>
            The KJCOEMR Alumni Portal provides a centralized
            platform where alumni can stay connected with the
            college, participate in events, share achievements
            and contribute to the growth of future generations.
          </p>

        </div>
      </section>


      {/* CTA */}
      <section className="cta">
        <div className="container">

          <h2>
            Are you a KJCOEMR Alumni?
          </h2>

          <p>
            Join the alumni network and stay connected
            with your college community.
          </p>

          <Link to="/register" className="primary-btn">
            Register Now
          </Link>

        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">

          <div>
            <h3>KJCOEMR Alumni</h3>
            <p>
              Connecting Alumni, Celebrating Success,
              Building the Future.
            </p>
          </div>

          <p>
            © 2026 KJCOEMR Alumni Association
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;