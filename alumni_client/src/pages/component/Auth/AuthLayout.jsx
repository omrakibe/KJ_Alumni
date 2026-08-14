import "./AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">

      <main className="auth-content">

        <div className="auth-brand">

          <div className="auth-logo">
            KJ
          </div>

          <div>
            <h2>KJCOEMR</h2>
            <span>Alumni Portal</span>
          </div>

        </div>

        <div className="auth-page-content">
          {children}
        </div>

        <footer className="auth-footer">
          © {new Date().getFullYear()} KJCOEMR Alumni Portal
        </footer>

      </main>

    </div>
  );
}

export default AuthLayout;