import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  LockKeyhole,
} from "lucide-react";

import { registerAlumni } from "../../services/authService";
import { BRANCHES } from "./authConstants";

import AuthLayout from "../../component/Auth/AuthLayout";
import FlashMessage from "../../component/Auth/FlashMessage";

import "../../styles/auth.css";
import "../../styles/flashMessage.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    dob: "",
    branch: "",
    passoutYear: "",
    company: "",
    jobRole: "",
    currentPackage: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error for the field being edited
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    // Remove previous flash message
    setFlash(null);
  };

  // --------------------------------------------------
  // Validate form
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
    }

    if (!formData.branch) {
      newErrors.branch = "Please select your branch.";
    }

    if (!formData.passoutYear) {
      newErrors.passoutYear = "Passout year is required.";
    } else if (!/^\d{4}$/.test(formData.passoutYear)) {
      newErrors.passoutYear = "Enter a valid passout year.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required.";
    }

    if (!formData.jobRole.trim()) {
      newErrors.jobRole = "Job role is required.";
    }

    if (formData.currentPackage === "") {
      newErrors.currentPackage = "Current package is required.";
    } else if (Number(formData.currentPackage) < 0) {
      newErrors.currentPackage = "Package cannot be negative.";
    }

    if (formData.experience === "") {
      newErrors.experience = "Experience is required.";
    } else if (Number(formData.experience) < 0) {
      newErrors.experience = "Experience cannot be negative.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // Submit registration
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFlash(null);

    if (!validateForm()) {
      setFlash({
        type: "warning",
        title: "Validation Error",
        message:
          "Please fill in all required fields correctly.",
      });

      return;
    }

    setLoading(true);

    try {
      /*
       * confirmPassword is intentionally NOT sent
       * to the backend.
       */
      const requestData = {
        firstName: formData.firstName.trim(),

        ...(formData.middleName.trim() && {
          middleName: formData.middleName.trim(),
        }),

        lastName: formData.lastName.trim(),

        email: formData.email.trim(),

        contactNumber: formData.contactNumber.trim(),

        dob: formData.dob,

        /*
         * This sends exactly the backend-supported
         * branch value:
         *
         * COMP
         * ENTC
         * VLSI
         * ADVENTC
         * MECH
         * CIVIL
         * ELECTRICAL
         */
        branch: formData.branch,

        passoutYear: Number(formData.passoutYear),

        company: formData.company.trim(),

        jobRole: formData.jobRole.trim(),

        currentPackage: Number(formData.currentPackage),

        experience: Number(formData.experience),

        password: formData.password,
      };

      const response = await registerAlumni(requestData);

      if (response.success) {
        /*
         * Backend message is displayed dynamically.
         */
        setFlash({
          type: "success",
          title: "Registration Successful",
          message: response.message,
        });

        /*
         * Give the user a moment to see the
         * success flash message before moving
         * to OTP verification.
         */
        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              email: formData.email.trim(),
            },
          });
        }, 1200);

      } else {
        setFlash({
          type: "error",
          title: "Registration Failed",
          message:
            response.message ||
            "Registration could not be completed.",
        });
      }
    } catch (error) {
      /*
       * If Spring Boot returned an error response,
       * show its message.
       *
       * Otherwise show the connection message.
       */
      setFlash({
        type: "error",
        title: "Registration Failed",
        message:
          error.response?.data?.message ||
          "Unable to connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <AuthLayout>
      <div className="auth-card">
        {/* Header */}

        <div className="auth-header">
          <h1>Create Your Alumni Account</h1>

          <p>Join the KJCOEMR Alumni Network</p>
        </div>

        {/* Flash message */}

        {flash && (
          <FlashMessage
            type={flash.type}
            title={flash.title}
            message={flash.message}
            onClose={() => setFlash(null)}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* =========================================
              PERSONAL INFORMATION
          ========================================== */}

          <section className="form-section">
            <h2>
              <UserRound size={19} />
              Personal Information
            </h2>

            <div className="form-grid">
              {/* First Name */}

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span>*</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  disabled={loading}
                />

                {errors.firstName && (
                  <small className="field-error">
                    {errors.firstName}
                  </small>
                )}
              </div>

              {/* Middle Name */}

              <div className="form-group">
                <label htmlFor="middleName">
                  Middle Name
                </label>

                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Enter middle name"
                  disabled={loading}
                />
              </div>

              {/* Last Name */}

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span>*</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  disabled={loading}
                />

                {errors.lastName && (
                  <small className="field-error">
                    {errors.lastName}
                  </small>
                )}
              </div>

              {/* Date of Birth */}

              <div className="form-group">
                <label htmlFor="dob">
                  Date of Birth <span>*</span>
                </label>

                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={loading}
                />

                {errors.dob && (
                  <small className="field-error">
                    {errors.dob}
                  </small>
                )}
              </div>

              {/* Contact Number */}

              <div className="form-group">
                <label htmlFor="contactNumber">
                  Contact Number <span>*</span>
                </label>

                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  disabled={loading}
                />

                {errors.contactNumber && (
                  <small className="field-error">
                    {errors.contactNumber}
                  </small>
                )}
              </div>

              {/* Email */}

              <div className="form-group">
                <label htmlFor="email">
                  Email <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading}
                />

                {errors.email && (
                  <small className="field-error">
                    {errors.email}
                  </small>
                )}
              </div>
            </div>
          </section>

          {/* =========================================
              ACADEMIC INFORMATION
          ========================================== */}

          <section className="form-section">
            <h2>
              <GraduationCap size={19} />
              Academic Information
            </h2>

            <div className="form-grid">
              {/* Branch */}

              <div className="form-group">
                <label htmlFor="branch">
                  Branch <span>*</span>
                </label>

                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">
                    Select your branch
                  </option>

                  {BRANCHES.map((branch) => (
                    <option
                      key={branch.value}
                      value={branch.value}
                    >
                      {branch.label}
                    </option>
                  ))}
                </select>

                {errors.branch && (
                  <small className="field-error">
                    {errors.branch}
                  </small>
                )}
              </div>

              {/* Passout Year */}

              <div className="form-group">
                <label htmlFor="passoutYear">
                  Passout Year <span>*</span>
                </label>

                <input
                  id="passoutYear"
                  name="passoutYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.passoutYear}
                  onChange={handleChange}
                  placeholder="2026"
                  disabled={loading}
                />

                {errors.passoutYear && (
                  <small className="field-error">
                    {errors.passoutYear}
                  </small>
                )}
              </div>
            </div>
          </section>

          {/* =========================================
              PROFESSIONAL INFORMATION
          ========================================== */}

          <section className="form-section">
            <h2>
              <BriefcaseBusiness size={19} />
              Professional Information
            </h2>

            <div className="form-grid">
              {/* Company */}

              <div className="form-group">
                <label htmlFor="company">
                  Company <span>*</span>
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="TCS"
                  disabled={loading}
                />

                {errors.company && (
                  <small className="field-error">
                    {errors.company}
                  </small>
                )}
              </div>

              {/* Job Role */}

              <div className="form-group">
                <label htmlFor="jobRole">
                  Job Role <span>*</span>
                </label>

                <input
                  id="jobRole"
                  name="jobRole"
                  type="text"
                  value={formData.jobRole}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  disabled={loading}
                />

                {errors.jobRole && (
                  <small className="field-error">
                    {errors.jobRole}
                  </small>
                )}
              </div>

              {/* Current Package */}

              <div className="form-group">
                <label htmlFor="currentPackage">
                  Current Package <span>*</span>
                </label>

                <input
                  id="currentPackage"
                  name="currentPackage"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.currentPackage}
                  onChange={handleChange}
                  placeholder="8.5"
                  disabled={loading}
                />

                {errors.currentPackage && (
                  <small className="field-error">
                    {errors.currentPackage}
                  </small>
                )}
              </div>

              {/* Experience */}

              <div className="form-group">
                <label htmlFor="experience">
                  Experience <span>*</span>
                </label>

                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="1.5"
                  disabled={loading}
                />

                {errors.experience && (
                  <small className="field-error">
                    {errors.experience}
                  </small>
                )}
              </div>
            </div>
          </section>

          {/* =========================================
              ACCOUNT SECURITY
          ========================================== */}

          <section className="form-section">
            <h2>
              <LockKeyhole size={19} />
              Account Security
            </h2>

            <div className="form-grid">
              {/* Password */}

              <div className="form-group">
                <label htmlFor="password">
                  Password <span>*</span>
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  disabled={loading}
                />

                {errors.password && (
                  <small className="field-error">
                    {errors.password}
                  </small>
                )}
              </div>

              {/* Confirm Password */}

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password <span>*</span>
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  disabled={loading}
                />

                {errors.confirmPassword && (
                  <small className="field-error">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>
            </div>
          </section>

          {/* Submit */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Login */}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link-button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;