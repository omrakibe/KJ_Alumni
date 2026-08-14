import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

import { resetPassword } from "../../services/authService";

import "./ResetPassword.css";


function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    new URLSearchParams(location.search).get("email") ||
    "";

  const token =
    location.state?.token ||
    new URLSearchParams(location.search).get("token") ||
    "";

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [flash, setFlash] = useState({
    type: "",
    message: "",
  });


  // =========================================
  // FLASH MESSAGE
  // =========================================

  const showFlash = (type, message) => {
    setFlash({
      type,
      message,
    });
  };


  // =========================================
  // PASSWORD VALIDATION
  // =========================================

  const validatePassword = () => {
    if (!password) {
      return "Please enter a new password.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };


  // =========================================
  // RESET PASSWORD
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFlash({
      type: "",
      message: "",
    });

    const validationError =
      validatePassword();

    if (validationError) {
      showFlash(
        "error",
        validationError
      );

      return;
    }

    if (!email && !token) {
      showFlash(
        "error",
        "Password reset information is missing. Please request a new reset link."
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * The service receives the available
       * reset information.
       *
       * Your authService should match this
       * structure with the backend API.
       */

      const response = await resetPassword({
        email,
        token,
        password,
        confirmPassword,
      });

      if (response.success) {
        showFlash(
          "success",
          response.message ||
            "Password reset successfully."
        );

        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                response.message ||
                "Password reset successfully. Please login.",
              email,
            },
          });
        }, 1800);
      } else {
        showFlash(
          "error",
          response.message ||
            "Unable to reset password."
        );
      }
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      showFlash(
        "error",
        error.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="reset-password-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="reset-password-header">

        <div className="reset-password-icon">
          <KeyRound
            size={30}
            strokeWidth={1.8}
          />
        </div>

        <span className="reset-password-eyebrow">
          PASSWORD RESET
        </span>

        <h1>
          Create a new password
        </h1>

        <p>
          Choose a strong password for your
          account.
        </p>

        {email && (
          <div className="reset-password-email">
            {email}
          </div>
        )}

      </div>


      {/* =====================================
          FLASH MESSAGE
      ====================================== */}

      {flash.message && (
        <div
          className={`reset-password-flash ${
            flash.type === "success"
              ? "reset-password-flash-success"
              : "reset-password-flash-error"
          }`}
        >
          {flash.message}
        </div>
      )}


      {/* =====================================
          CARD
      ====================================== */}

      <div className="reset-password-card">

        <div className="reset-password-card-title">

          <ShieldCheck
            size={20}
            strokeWidth={2}
          />

          <span>
            Set new password
          </span>

        </div>


        <p className="reset-password-description">
          Your new password should contain at
          least 8 characters.
        </p>


        <form
          onSubmit={handleSubmit}
          className="reset-password-form"
        >

          {/* =================================
              NEW PASSWORD
          ================================== */}

          <div className="reset-password-field">

            <label htmlFor="password">
              New Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter new password"
                disabled={loading}
                autoComplete="new-password"
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
                tabIndex="-1"
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

          <div className="reset-password-field">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="confirmPassword"
                name="confirmPassword"
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
                disabled={loading}
                autoComplete="new-password"
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
                tabIndex="-1"
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
            className="reset-password-button"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>


      {/* =====================================
          BACK TO LOGIN
      ====================================== */}

      <button
        type="button"
        className="reset-password-back-button"
        onClick={() => navigate("/login")}
      >

        <ArrowLeft size={16} />

        Back to login

      </button>

    </div>
  );
}


export default ResetPassword;