import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          KJCOEMR
          <span>Admin Portal</span>
        </div>

        <nav className="admin-menu">

          <Link
            to="/admin/dashboard"
            className="admin-link active"
          >
            Dashboard
          </Link>

          <Link to="/admin/alumni" className="admin-link">
            Alumni Management
          </Link>

          <Link to="/admin/events" className="admin-link">
            Events
          </Link>

          <Link to="/admin/announcements" className="admin-link">
            Announcements
          </Link>

          <Link to="/admin/jobs" className="admin-link">
            Job Management
          </Link>

          <Link to="/admin/stories" className="admin-link">
            Success Stories
          </Link>

          <Link to="/admin/gallery" className="admin-link">
            Gallery
          </Link>

          <Link to="/admin/reports" className="admin-link">
            Reports
          </Link>

        </nav>

        <div className="admin-bottom">

          <Link to="/" className="admin-link">
            View Website
          </Link>

          <Link to="/login" className="admin-link admin-logout">
            Logout
          </Link>

        </div>

      </aside>


      {/* Main */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage the KJCOEMR alumni platform.
            </p>
          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Alumni Cell</span>
            </div>

          </div>

        </header>


        {/* Statistics */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Alumni</span>
            <strong>12,500</strong>
            <small>Verified alumni</small>
          </div>

          <div className="admin-stat-card">
            <span>Pending Registrations</span>
            <strong>24</strong>
            <small>Requires approval</small>
          </div>

          <div className="admin-stat-card">
            <span>Upcoming Events</span>
            <strong>18</strong>
            <small>Active events</small>
          </div>

          <div className="admin-stat-card">
            <span>Pending Jobs</span>
            <strong>37</strong>
            <small>Requires review</small>
          </div>

        </section>


        {/* Quick Actions */}
        <section className="quick-actions">

          <div className="section-heading">
            <h2>Quick Actions</h2>
            <p>Frequently used administration tools.</p>
          </div>

          <div className="quick-action-grid">

            <Link to="/admin/alumni" className="quick-action">
              <div className="quick-icon blue">
                A
              </div>

              <div>
                <h3>Manage Alumni</h3>
                <p>Approve and manage alumni</p>
              </div>
            </Link>


            <Link to="/admin/events" className="quick-action">
              <div className="quick-icon green">
                E
              </div>

              <div>
                <h3>Create Event</h3>
                <p>Manage alumni events</p>
              </div>
            </Link>


            <Link
              to="/admin/announcements"
              className="quick-action"
            >
              <div className="quick-icon orange">
                N
              </div>

              <div>
                <h3>Announcement</h3>
                <p>Publish college updates</p>
              </div>
            </Link>


            <Link to="/admin/jobs" className="quick-action">
              <div className="quick-icon purple">
                J
              </div>

              <div>
                <h3>Review Jobs</h3>
                <p>Approve job postings</p>
              </div>
            </Link>

          </div>

        </section>


        {/* Main Content */}
        <section className="admin-content-grid">

          {/* Pending Alumni */}
          <div className="admin-card">

            <div className="admin-card-header">

              <div>
                <h2>Pending Alumni Registrations</h2>
                <p>Users waiting for approval</p>
              </div>

              <Link to="/admin/alumni">
                View All
              </Link>

            </div>


            <div className="pending-user">

              <div className="pending-avatar">
                RP
              </div>

              <div className="pending-info">
                <strong>Rahul Patil</strong>
                <span>Computer Engineering • 2025</span>
              </div>

              <button className="approve-button">
                Approve
              </button>

            </div>


            <div className="pending-user">

              <div className="pending-avatar">
                SP
              </div>

              <div className="pending-info">
                <strong>Sneha Patil</strong>
                <span>Information Technology • 2024</span>
              </div>

              <button className="approve-button">
                Approve
              </button>

            </div>


            <div className="pending-user">

              <div className="pending-avatar">
                AK
              </div>

              <div className="pending-info">
                <strong>Akash Kulkarni</strong>
                <span>Computer Engineering • 2025</span>
              </div>

              <button className="approve-button">
                Approve
              </button>

            </div>

          </div>


          {/* Recent Activities */}
          <div className="admin-card">

            <div className="admin-card-header">

              <div>
                <h2>Recent Activities</h2>
                <p>Latest system activities</p>
              </div>

            </div>


            <div className="activity">

              <div className="activity-icon success">
                ✓
              </div>

              <div>
                <strong>Alumni approved</strong>
                <p>Viraj Pawar was approved.</p>
                <span>10 minutes ago</span>
              </div>

            </div>


            <div className="activity">

              <div className="activity-icon event">
                E
              </div>

              <div>
                <strong>New event created</strong>
                <p>Alumni Meet 2027 was created.</p>
                <span>1 hour ago</span>
              </div>

            </div>


            <div className="activity">

              <div className="activity-icon job">
                J
              </div>

              <div>
                <strong>Job submitted</strong>
                <p>A new job requires approval.</p>
                <span>2 hours ago</span>
              </div>

            </div>

          </div>

        </section>


        {/* Recent Jobs */}
        <section className="admin-card recent-jobs">

          <div className="admin-card-header">

            <div>
              <h2>Pending Job Posts</h2>
              <p>Jobs waiting for administrator approval</p>
            </div>

            <Link to="/admin/jobs">
              View All
            </Link>

          </div>


          <div className="admin-job-table">

            <div className="admin-job-row admin-job-header">
              <span>Position</span>
              <span>Company</span>
              <span>Posted By</span>
              <span>Location</span>
              <span>Action</span>
            </div>


            <div className="admin-job-row">

              <span>Software Engineer</span>
              <span>Tech Solutions</span>
              <span>Rahul Patil</span>
              <span>Pune</span>

              <button className="review-button">
                Review
              </button>

            </div>


            <div className="admin-job-row">

              <span>Frontend Developer</span>
              <span>ABC Technologies</span>
              <span>Sneha Patil</span>
              <span>Mumbai</span>

              <button className="review-button">
                Review
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;