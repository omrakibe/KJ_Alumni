import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  LogIn,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import AuthLayout from "../../component/Auth/AuthLayout";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const { login: setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
 
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [flash, setFlash] = useState({
    type: "",
    message: "",
  });

  /*
   * =========================================
   * INPUT CHANGE
   * =========================================
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * =========================================
   * LOGIN
   *
   * POST /api/auth/login
   *
   * {
   *   "email": "...",
   *   "password": "..."
   * }
   * =========================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFlash({
      type: "",
      message: "",
    });

    const email = formData.email.trim();

    if (!email || !formData.password) {
      setFlash({
        type: "error",
        message: "Please enter your email and password.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,
        password: formData.password,
      });

      if (response.success) {
        const token = response.data?.token;

        if (!token) {
          setFlash({
            type: "error",
            message: "Login succeeded but no authentication token was received.",
          });

          return;
        }

        /*
         * Store exactly what the backend returned.
         */
        setAuthenticatedUser(token, null);

        setFlash({
          type: "success",
          message: response.message || "Login successful.",
        });

        /*
         * We do NOT decide admin/alumni here because
         * the login response currently provides only:
         *
         * token
         * type
         *
         * Once the backend provides role information,
         * we can route accordingly.
         */
        if (!token) {
          setFlash({
            type: "error",
            message:
              "Login successful, but authentication token was not received.",
          });

          return;
        }

        const decodedToken = jwtDecode(token);

        const role =
          decodedToken.role ||
          decodedToken.roles?.[0];

        console.log("Decoded JWT:", decodedToken);
        console.log("User role:", role);

        setFlash({
          type: "success",
          message: response.message || "Login successful.",
        });

        setTimeout(() => {
          if (role === "ADMIN") {
            navigate("/admin/dashboard");
          } else if (role === "ALUMNI") {
            navigate("/alumni/dashboard");
          } else {
            setFlash({
              type: "error",
              message:
                "Login successful, but your account role could not be determined.",
            });
          }
        }, 800);
      } else {
        setFlash({
          type: "error",
          message:
            response.message ||
            "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      setFlash({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-content">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="login-header">

          <div className="login-icon">
            <LogIn
              size={29}
              strokeWidth={1.9}
            />
          </div>

          <span className="login-eyebrow">
            KJCOEMR ALUMNI NETWORK
          </span>

          <h1>
            Welcome back
          </h1>

          <p>
            Sign in to continue to your alumni
            account.
          </p>

        </div>

        {/* =====================================
            FLASH MESSAGE
        ====================================== */}

        {flash.message && (
          <div
            className={`login-flash ${flash.type === "success"
              ? "login-flash-success"
              : "login-flash-error"
              }`}
          >
            {flash.message}
          </div>
        )}

       

        <div className="login-card">

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <Mail
                  size={18}
                  strokeWidth={1.8}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-field">

              <div className="login-password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() =>
                    navigate("/forgot-password")
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input-wrapper">

                <LockKeyhole
                  size={18}
                  strokeWidth={1.8}
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>

          </div>

        </div>

      </div>
    </AuthLayout>
  );
}

export default Login;
