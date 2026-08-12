import { useEffect, useState } from "react";

import {
  getRegistrations,
  approveRegistration,
  rejectRegistration,
} from "../../../services/registrationService";

import "./Registrations.css";


function Registrations() {

  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [selectedRegistration, setSelectedRegistration] =
    useState(null);

  const [rejectReason, setRejectReason] = useState("");

  const [processingId, setProcessingId] = useState(null);


  // ========================================
  // LOAD REGISTRATIONS
  // ========================================

  const loadRegistrations = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await getRegistrations();

      console.log(
        "REGISTRATIONS RESPONSE:",
        response
      );


      if (response.success) {

        setRegistrations(
          response.data || []
        );

      } else {

        setError(
          response.message ||
          "Failed to load registrations."
        );

      }

    } catch (error) {

      console.error(
        "REGISTRATIONS ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load registrations."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {

    loadRegistrations();

  }, []);


  // ========================================
  // APPROVE REGISTRATION
  // ========================================

  const handleApprove = async (
    registrationId
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to approve this registration?"
    );


    if (!confirmed) {
      return;
    }


    try {

      setProcessingId(registrationId);

      setError("");

      setSuccess("");


      const response =
        await approveRegistration(
          registrationId
        );


      if (response.success) {

        setSuccess(
          "Registration approved successfully."
        );

        await loadRegistrations();

      } else {

        setError(
          response.message ||
          "Failed to approve registration."
        );

      }

    } catch (error) {

      console.error(
        "APPROVE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to approve registration."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // ========================================
  // OPEN REJECT MODAL
  // ========================================

  const openRejectModal = (
    registration
  ) => {

    setSelectedRegistration(
      registration
    );

    setRejectReason("");

    setError("");

    setSuccess("");

  };


  // ========================================
  // CLOSE REJECT MODAL
  // ========================================

  const closeRejectModal = () => {

    setSelectedRegistration(null);

    setRejectReason("");

  };


  // ========================================
  // REJECT REGISTRATION
  // ========================================

  const handleReject = async (e) => {

    e.preventDefault();


    if (!rejectReason.trim()) {

      setError(
        "Please provide a rejection reason."
      );

      return;

    }


    try {

      setProcessingId(
        selectedRegistration.id
      );

      setError("");

      setSuccess("");


      const response =
        await rejectRegistration(
          selectedRegistration.id,
          rejectReason.trim()
        );


      if (response.success) {

        setSuccess(
          "Registration rejected successfully."
        );

        closeRejectModal();

        await loadRegistrations();

      } else {

        setError(
          response.message ||
          "Failed to reject registration."
        );

      }

    } catch (error) {

      console.error(
        "REJECT ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to reject registration."
      );

    } finally {

      setProcessingId(null);

    }

  };


  // ========================================
  // SEARCH
  // ========================================

  const filteredRegistrations =
    registrations.filter((registration) => {

      const searchText =
        search.toLowerCase().trim();


      if (!searchText) {
        return true;
      }


      const firstName =
        registration.firstName || "";

      const lastName =
        registration.lastName || "";

      const email =
        registration.email || "";

      const branch =
        registration.branch ||
        registration.branchCode ||
        "";

      const company =
        registration.company || "";


      return (
        firstName
          .toLowerCase()
          .includes(searchText) ||

        lastName
          .toLowerCase()
          .includes(searchText) ||

        email
          .toLowerCase()
          .includes(searchText) ||

        branch
          .toLowerCase()
          .includes(searchText) ||

        company
          .toLowerCase()
          .includes(searchText)
      );

    });


  // ========================================
  // FULL NAME
  // ========================================

  const getFullName = (registration) => {

    return [
      registration.firstName,
      registration.middleName,
      registration.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  };


  return (

    <div className="registrations-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="registrations-header">

        <div>

          <h1>
            Alumni Registrations
          </h1>

          <p>
            Review verified alumni registration
            applications.
          </p>

        </div>


        <div className="registration-count">

          <span>
            Total
          </span>

          <strong>
            {registrations.length}
          </strong>

        </div>

      </div>


      {/* ==================================
          SUCCESS
      ================================== */}

      {success && (

        <div className="success-message">

          {success}

        </div>

      )}


      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* ==================================
          SEARCH
      ================================== */}

      <div className="registration-toolbar">

        <input
          type="text"
          placeholder="Search by name, email, branch or company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* ==================================
          LOADING
      ================================== */}

      {loading && (

        <div className="registration-state">

          <p>
            Loading registrations...
          </p>

        </div>

      )}


      {/* ==================================
          EMPTY
      ================================== */}

      {!loading &&
        filteredRegistrations.length === 0 && (

          <div className="registration-state">

            <h3>
              No registrations found
            </h3>

            <p>
              There are currently no verified
              registrations to review.
            </p>

          </div>

        )}


      {/* ==================================
          REGISTRATION LIST
      ================================== */}

      {!loading &&
        filteredRegistrations.length > 0 && (

          <div className="registration-list">

            {filteredRegistrations.map(
              (registration) => {

                const fullName =
                  getFullName(
                    registration
                  );


                const branch =
                  registration.branch ||
                  registration.branchCode ||
                  "N/A";


                const isProcessing =
                  processingId ===
                  registration.id;


                return (

                  <div
                    className="registration-card"
                    key={registration.id}
                  >


                    {/* USER INFO */}

                    <div className="registration-main">

                      <div className="registration-avatar">

                        {registration.firstName
                          ?.charAt(0)
                          ?.toUpperCase() || "A"}

                      </div>


                      <div className="registration-info">

                        <h3>
                          {fullName ||
                            "Unnamed Alumni"}
                        </h3>

                        <p>
                          {registration.email}
                        </p>

                        <div className="registration-meta">

                          <span>
                            Branch: {branch}
                          </span>

                          <span>
                            Passout:{" "}
                            {registration.passoutYear ||
                              "N/A"}
                          </span>

                          <span>
                            Company:{" "}
                            {registration.company ||
                              "N/A"}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* EMAIL STATUS */}

                    <div className="verification-status">

                      <span className="verified-badge">
                        ✓ Email Verified
                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="registration-actions">

                      <button
                        className="approve-button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleApprove(
                            registration.id
                          )
                        }
                      >

                        {isProcessing
                          ? "Processing..."
                          : "Approve"}

                      </button>


                      <button
                        className="reject-button"
                        disabled={isProcessing}
                        onClick={() =>
                          openRejectModal(
                            registration
                          )
                        }
                      >

                        Reject

                      </button>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}


      {/* ==================================
          REJECT MODAL
      ================================== */}

      {selectedRegistration && (

        <div className="modal-overlay">

          <div className="reject-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Reject Registration
                </h2>

                <p>
                  {getFullName(
                    selectedRegistration
                  )}
                </p>

              </div>


              <button
                className="modal-close"
                onClick={
                  closeRejectModal
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleReject}
            >

              <div className="form-group">

                <label>
                  Rejection Reason
                </label>

                <textarea
                  value={rejectReason}
                  onChange={(e) =>
                    setRejectReason(
                      e.target.value
                    )
                  }
                  placeholder="Enter the reason for rejecting this registration..."
                  rows="5"
                  required
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    closeRejectModal
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="confirm-reject-button"
                  disabled={
                    processingId ===
                    selectedRegistration.id
                  }
                >

                  {processingId ===
                  selectedRegistration.id
                    ? "Rejecting..."
                    : "Reject Registration"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}


export default Registrations;