import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  KeyRound,
  Send,
} from "lucide-react";

import AuthLayout from "../../component/Auth/AuthLayout";

import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [flash, setFlash] = useState({
    type: "",
    message: "",
  });

  /*
   * =========================================
   * EMAIL CHANGE
   * =========================================
   */

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  /*
   * =========================================
   * FORGOT PASSWORD
   *
   * POST /api/auth/forgot-password
   *
   * Request:
   * {
   *   "email": "om@kjei.edu.in"
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "...",
   *   "data": {
   *     "resetRequestId": "..."
   *   }
   * }
   * =========================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFlash({
      type: "",
      message: "",
    });

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFlash({
        type: "error",
        message: "Please enter your email address.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: trimmedEmail,
      });

      if (response.success) {
        /*
         * Backend gives us the resetRequestId.
         */
        const resetRequestId =
          response.data?.resetRequestId;

        if (!resetRequestId) {
          setFlash({
            type: "error",
            message:
              "The password reset request was successful, but no reset request ID was received.",
          });

          return;
        }

        /*
         * Show backend's exact message first.
         */
        setFlash({
          type: "success",
          message: response.message,
        });

        /*
         * Give the user a moment to see the
         * success flash before moving to OTP.
         */
        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              resetRequestId,
              email: trimmedEmail,
            },
          });
        }, 1500);
      } else {
        setFlash({
          type: "error",
          message:
            response.message ||
            "Unable to process the password reset request.",
        });
      }
    } catch (error) {
      setFlash({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to process the password reset request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * UI
   * =========================================
   */

  return (
    <AuthLayout>
      <div className="forgot-content">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="forgot-header">

          <div className="forgot-icon">
            <KeyRound
              size={30}
              strokeWidth={1.8}
            />
          </div>

          <span className="forgot-eyebrow">
            ACCOUNT RECOVERY
          </span>

          <h1>
            Forgot your password?
          </h1>

          <p>
            Enter your registered email address
            and we'll send you a password reset
            OTP.
          </p>

        </div>

        {/* =====================================
            FLASH MESSAGE
        ====================================== */}

        {flash.message && (
          <div
            className={`forgot-flash ${flash.type === "success"
              ? "forgot-flash-success"
              : "forgot-flash-error"
              }`}
          >
            {flash.message}
          </div>
        )}

        {/* =====================================
            FORM CARD
        ====================================== */}

        <div className="forgot-card">

          <div className="forgot-card-title">

            <Mail
              size={20}
              strokeWidth={2}
            />

            <span>
              Reset your password
            </span>

          </div>

          <p className="forgot-description">
            We'll send a 6-digit OTP to your
            registered email address.
          </p>

          <form
            onSubmit={handleSubmit}
            className="forgot-form"
          >

            {/* EMAIL */}

            <div className="forgot-field">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <div className="forgot-input-wrapper">

                <Mail
                  size={18}
                  strokeWidth={1.8}
                />

                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  autoFocus
                />

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="forgot-button"
              disabled={loading}
            >
              <Send
                size={17}
                strokeWidth={2}
              />

              {loading
                ? "Sending..."
                : "Send Reset OTP"}
            </button>

          </form>

          {/* ===================================
              BACK TO LOGIN
          ==================================== */}

          <div className="forgot-login">

            <span>
              Remember your password?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

          </div>

        </div>

        {/* =====================================
            BACK BUTTON
        ====================================== */}

        <button
          type="button"
          className="forgot-back-button"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={16} />

          Back to login
        </button>

      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;