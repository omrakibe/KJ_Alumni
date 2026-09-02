import {
  Globe2,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

import collegeLogo from "../../assets/kjcoemr-logo.png";
import campusImage from "../../assets/kjcoemr.webp";

function AuthLayout({ children }) {
  return (
    <div className="auth-shell">

      <aside className="auth-hero">
        <img
          src={campusImage}
          alt="KJCOEMR Campus"
          className="auth-hero-image"
        />

        <div className="auth-hero-overlay" />

        <div className="auth-hero-content">
          {/* Logo */}

          <div className="auth-logo-container">
            <img
              src={collegeLogo}
              alt="KJCOEMR"
              className="auth-logo"
            />
          </div>

          {/* Main message */}

          <div className="auth-hero-text">
            <span className="auth-hero-eyebrow">
              KJCOEMR CONNECT
            </span>

            <h1>
              Stay connected.
              <br />
              Grow together.
              <br />
              <span>Inspire beyond.</span>
            </h1>

            <p>
              Reconnect with your college community,
              discover new opportunities and continue
              the journey together.
            </p>
          </div>

          {/* Benefits */}

          <div className="auth-benefits">
            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                <Globe2 size={18} strokeWidth={2} />
              </div>

              <div>
                <strong>Global Network</strong>
                <span>Connect with alumni worldwide</span>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                <BriefcaseBusiness
                  size={18}
                  strokeWidth={2}
                />
              </div>

              <div>
                <strong>Career Growth</strong>
                <span>Discover opportunities and resources</span>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="auth-benefit-icon">
                <CalendarDays
                  size={18}
                  strokeWidth={2}
                />
              </div>

              <div>
                <strong>Stay Updated</strong>
                <span>Events, reunions and community news</span>
              </div>
            </div>
          </div>

          {/* Bottom branding */}

          <div className="auth-hero-footer">
            KJ College of Engineering and Management Research
            <br />
            Pune
          </div>
        </div>
      </aside>

      {/* =========================================
          RIGHT CONTENT
      ========================================== */}

      <main className="auth-main">
        <div className="auth-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
