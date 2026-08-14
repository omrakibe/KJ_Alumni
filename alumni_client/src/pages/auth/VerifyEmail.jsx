import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../component/Auth/AuthLayout";
import {
  MailCheck,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import {
  verifyEmailOtp,
  resendOtp,
} from "../../services/authService";


function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from Register page
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const [flash, setFlash] = useState({
    type: "",
    message: "",
  });


  // =========================================
  // RESEND TIMER
  // =========================================

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);


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
  // OTP INPUT
  // =========================================

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };


  // =========================================
  // VERIFY OTP
  // POST /api/auth/verify-otp
  // =========================================

  const handleVerify = async (event) => {
    event.preventDefault();

    setFlash({
      type: "",
      message: "",
    });

    if (!email) {
      showFlash(
        "error",
        "Email information is missing. Please register again."
      );

      return;
    }

    if (otp.length !== 6) {
      showFlash(
        "error",
        "Please enter the complete 6-digit OTP."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await verifyEmailOtp({
        email,
        otp,
      });

      if (response.success) {
        showFlash(
          "success",
          response.message ||
            "Email verified successfully."
        );

        setTimeout(() => {
          navigate("/login", {
            state: {
              message: response.message,
              email,
            },
          });
        }, 1800);
      } else {
        showFlash(
          "error",
          response.message ||
            "Unable to verify the OTP."
        );
      }
    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      showFlash(
        "error",
        error.response?.data?.message ||
          "Unable to verify the OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================================
  // RESEND OTP
  // POST /api/auth/resend-otp
  // =========================================

  const handleResend = async () => {
    if (
      !email ||
      resendTimer > 0 ||
      resending
    ) {
      return;
    }

    try {
      setResending(true);

      setFlash({
        type: "",
        message: "",
      });

      const response = await resendOtp({
        email,
      });

      if (response.success) {
        showFlash(
          "success",
          response.message ||
            "A new OTP has been sent."
        );

        setOtp("");

        setResendTimer(60);
      } else {
        showFlash(
          "error",
          response.message ||
            "Unable to resend OTP."
        );
      }
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error
      );

      showFlash(
        "error",
        error.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };


  // =========================================
  // UI
  // =========================================

  return (
    <div className="verify-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="verify-header">

        <div className="verify-icon">
          <MailCheck
            size={30}
            strokeWidth={1.8}
          />
        </div>

        <span className="verify-eyebrow">
          EMAIL VERIFICATION
        </span>

        <h1>
          Verify your email
        </h1>

        <p>
          We've sent a 6-digit verification
          code to
        </p>

        <div className="verify-email">
          {email || "your email address"}
        </div>

      </div>


      {/* =====================================
          FLASH MESSAGE
      ====================================== */}

      {flash.message && (
        <div
          className={`verify-flash ${
            flash.type === "success"
              ? "verify-flash-success"
              : "verify-flash-error"
          }`}
        >
          {flash.message}
        </div>
      )}


      {/* =====================================
          OTP CARD
      ====================================== */}

      <div className="verify-card">

        <div className="verify-card-title">

          <ShieldCheck
            size={20}
            strokeWidth={2}
          />

          <span>
            Enter verification code
          </span>

        </div>


        <p className="verify-card-description">
          Enter the 6-digit OTP sent to your
          registered email address.
        </p>


        {/* ===================================
            VERIFY FORM
        ==================================== */}

        <form
          onSubmit={handleVerify}
          className="verify-form"
        >

          <div className="verify-field">

            <label htmlFor="otp">
              Verification Code
            </label>

            <div className="otp-wrapper">

              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                disabled={loading}
                autoFocus
              />

            </div>

            <span className="otp-helper">
              Enter all 6 digits
            </span>

          </div>


          <button
            type="submit"
            className="verify-button"
            disabled={
              loading ||
              otp.length !== 6 ||
              !email
            }
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

        </form>


        {/* ===================================
            RESEND OTP
        ==================================== */}

        <div className="resend-area">

          <p>
            Didn't receive the code?
          </p>

          <button
            type="button"
            className="resend-button"
            onClick={handleResend}
            disabled={
              resending ||
              resendTimer > 0 ||
              !email
            }
          >

            <RefreshCw
              size={16}
              className={
                resending
                  ? "spin"
                  : ""
              }
            />

            {resending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}

          </button>

        </div>

      </div>


      {/* =====================================
          BACK TO REGISTRATION
      ====================================== */}

      <button
        type="button"
        className="verify-back-button"
        onClick={() => navigate("/register")}
      >

        <ArrowLeft size={16} />

        Back to registration

      </button>

    </div>
  );
}


export default VerifyEmail;