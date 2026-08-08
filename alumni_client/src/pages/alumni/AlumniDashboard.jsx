import { Link } from "react-router-dom";
import "./AlumniDashboard.css";

function AlumniDashboard() {
  return (
    <div className="alumni-dashboard">

      {/* Sidebar */}
      <aside className="alumni-sidebar">

        <div className="dashboard-logo">
          KJCOEMR
          <span>Alumni Portal</span>
        </div>

        <nav className="sidebar-menu">

          <Link to="/alumni/dashboard" className="sidebar-link active">
            Dashboard
          </Link>

          <Link to="/alumni/profile" className="sidebar-link">
            My Profile
          </Link>

          <Link to="/alumni/events" className="sidebar-link">
            Events
          </Link>

          <Link to="/alumni/announcements" className="sidebar-link">
            Announcements
          </Link>

          <Link to="/alumni/jobs" className="sidebar-link">
            My Jobs
          </Link>

          <Link to="/alumni/notifications" className="sidebar-link">
            Notifications
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link">
            Back to Website
          </Link>

          <Link to="/login" className="sidebar-link logout-link">
            Logout
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="alumni-main">

        {/* Topbar */}
        <header className="alumni-topbar">

          <div>
            <h1>Alumni Dashboard</h1>
            <p>Welcome back! Here's what's happening in your alumni community.</p>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              PP
            </div>

            <div>
              <strong>Prathmesh Palkar</strong>
              <span>Alumni</span>
            </div>
          </div>

        </header>


        {/* Welcome Section */}
        <section className="welcome-section">

          <div>
            <p className="welcome-label">
              KJCOEMR ALUMNI
            </p>

            <h2>
              Welcome back, Prathmesh !
            </h2>

            <p>
              Stay connected with your college, discover events,
              share opportunities and keep your profile updated.
            </p>
          </div>

          <Link to="/alumni/profile" className="profile-button">
            Complete Profile
          </Link>

        </section>


        {/* Statistics */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="stat-icon blue">
              E
            </div>

            <div>
              <span>Upcoming Events</span>
              <strong>3</strong>
            </div>
          </div>


          <div className="dashboard-stat-card">
            <div className="stat-icon green">
              J
            </div>

            <div>
              <span>My Job Posts</span>
              <strong>2</strong>
            </div>
          </div>


          <div className="dashboard-stat-card">
            <div className="stat-icon orange">
              N
            </div>

            <div>
              <span>Notifications</span>
              <strong>5</strong>
            </div>
          </div>


          <div className="dashboard-stat-card">
            <div className="stat-icon purple">
              %
            </div>

            <div>
              <span>Profile Completion</span>
              <strong>80%</strong>
            </div>
          </div>

        </section>


        {/* Main Grid */}
        <section className="dashboard-grid">

          {/* Upcoming Events */}
          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h3>Upcoming Events</h3>
                <p>Events you may be interested in</p>
              </div>

              <Link to="/alumni/events">
                View All
              </Link>
            </div>


            <div className="event-item">

              <div className="event-date">
                <strong>20</strong>
                <span>JAN</span>
              </div>

              <div className="event-info">
                <h4>Alumni Meet 2027</h4>
                <p>KJCOEMR Campus</p>
                <span>10:00 AM</span>
              </div>

              <button className="small-button">
                View
              </button>

            </div>


            <div className="event-item">

              <div className="event-date">
                <strong>15</strong>
                <span>FEB</span>
              </div>

              <div className="event-info">
                <h4>Career Guidance Session</h4>
                <p>Seminar Hall</p>
                <span>11:00 AM</span>
              </div>

              <button className="small-button">
                View
              </button>

            </div>

          </div>


          {/* Announcements */}
          <div className="dashboard-card">

            <div className="card-header">

              <div>
                <h3>Recent Announcements</h3>
                <p>Latest updates from the college</p>
              </div>

              <Link to="/alumni/announcements">
                View All
              </Link>

            </div>


            <div className="announcement-item">

              <div className="announcement-dot"></div>

              <div>
                <h4>Alumni Meet Registration Open</h4>
                <p>
                  Registration for Alumni Meet 2027 has started.
                </p>
                <span>2 days ago</span>
              </div>

            </div>


            <div className="announcement-item">

              <div className="announcement-dot"></div>

              <div>
                <h4>College Achievement</h4>
                <p>
                  Congratulations to our alumni community.
                </p>
                <span>5 days ago</span>
              </div>

            </div>

          </div>

        </section>


        {/* Job Posts */}
        <section className="dashboard-card jobs-card">

          <div className="card-header">

            <div>
              <h3>My Recent Job Posts</h3>
              <p>Track your submitted job opportunities</p>
            </div>

            <Link to="/alumni/jobs">
              View All
            </Link>

          </div>


          <div className="job-table">

            <div className="job-row job-header">
              <span>Position</span>
              <span>Company</span>
              <span>Location</span>
              <span>Status</span>
            </div>


            <div className="job-row">

              <span>Software Engineer</span>
              <span>Tech Solutions</span>
              <span>Pune</span>

              <span className="status pending">
                Pending
              </span>

            </div>


            <div className="job-row">

              <span>Frontend Developer</span>
              <span>ABC Technologies</span>
              <span>Mumbai</span>

              <span className="status approved">
                Approved
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AlumniDashboard;