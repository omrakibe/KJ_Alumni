import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

import AuthLayout from "../../component/Auth/AuthLayout";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * resetRequestId comes from ForgotPassword.jsx
   */
  const resetRequestId =
    location.state?.resetRequestId || "";

  const email =
    location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [flash, setFlash] = useState({
    type: "",
    message: "",
  });

  /*
   * =========================================
   * OTP
   * =========================================
   */

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(
      /\D/g,
      ""
    );

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  /*
   * =========================================
   * RESET PASSWORD
   *
   * POST /api/auth/reset-password
   *
   * {
   *   "resetRequestId": "...",
   *   "otp": "482731",
   *   "newPassword": "NewPassword@123"
   * }
   * =========================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFlash({
      type: "",
      message: "",
    });

    /*
     * resetRequestId is mandatory because it
     * identifies the password reset request.
     */
    if (!resetRequestId) {
      setFlash({
        type: "error",
        message:
          "Password reset session is missing. Please request a new OTP.",
      });

      return;
    }

    if (otp.length !== 6) {
      setFlash({
        type: "error",
        message:
          "Please enter the complete 6-digit OTP.",
      });

      return;
    }

    if (!newPassword) {
      setFlash({
        type: "error",
        message:
          "Please enter your new password.",
      });

      return;
    }

    if (newPassword.length < 8) {
      setFlash({
        type: "error",
        message:
          "Password must contain at least 8 characters.",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      setFlash({
        type: "error",
        message:
          "Passwords do not match.",
      });

      return;
    }

    try {
      setLoading(true);

      const response =
        await resetPassword({
          resetRequestId,
          otp,
          newPassword,
        });

      if (response.success) {
        setFlash({
          type: "success",
          message: response.message,
        });

        /*
         * Give the user a moment to see the
         * success flash before going to login.
         */
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: response.message,
              email,
            },
          });
        }, 1500);
      } else {
        setFlash({
          type: "error",
          message:
            response.message ||
            "Unable to reset your password.",
        });
      }
    } catch (error) {
      setFlash({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to reset your password. Please try again.",
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
      <div className="reset-content">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="reset-header">

          <div className="reset-icon">
            <KeyRound
              size={30}
              strokeWidth={1.8}
            />
          </div>

          <span className="reset-eyebrow">
            PASSWORD RECOVERY
          </span>

          <h1>
            Reset your password
          </h1>

          <p>
            Enter the OTP sent to your email
            and create a new password.
          </p>

          {email && (
            <div className="reset-email">
              {email}
            </div>
          )}

        </div>

        {/* =====================================
            FLASH MESSAGE
        ====================================== */}

        {flash.message && (
          <div
            className={`reset-flash ${flash.type === "success"
              ? "reset-flash-success"
              : "reset-flash-error"
              }`}
          >
            {flash.message}
          </div>
        )}

        {/* =====================================
            RESET CARD
        ====================================== */}

        <div className="reset-card">

          <div className="reset-card-title">

            <ShieldCheck
              size={20}
              strokeWidth={2}
            />

            <span>
              Create a new password
            </span>

          </div>

          <p className="reset-description">
            Enter the 6-digit OTP and your new
            password below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="reset-form"
          >

            {/* =================================
                OTP
            ================================== */}

            <div className="reset-field">

              <label htmlFor="reset-otp">
                Verification Code
              </label>

              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                disabled={loading}
                autoFocus
                className="reset-otp-input"
              />

              <span className="reset-helper">
                Enter the 6-digit OTP sent to
                your email.
              </span>

            </div>

            {/* =================================
                NEW PASSWORD
            ================================== */}

            <div className="reset-field">

              <label htmlFor="new-password">
                New Password
              </label>

              <div className="reset-password-wrapper">

                <input
                  id="new-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
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

            {/* =================================
                CONFIRM PASSWORD
            ================================== */}

            <div className="reset-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="reset-password-wrapper">

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* =================================
                SUBMIT
            ================================== */}

            <button
              type="submit"
              className="reset-button"
              disabled={loading}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

          </form>

          {/* ===================================
              LOGIN
          ==================================== */}

          <div className="reset-login">

            <span>
              Remember your password?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>

          </div>

        </div>

        {/* =====================================
            BACK
        ====================================== */}

        <button
          type="button"
          className="reset-back-button"
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          <ArrowLeft size={16} />

          Back to forgot password
        </button>

      </div>
    </AuthLayout>
  );
}

export default ResetPassword;