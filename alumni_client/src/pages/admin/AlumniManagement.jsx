import { useMemo, useState } from "react";
import "./AlumniManagement.css";

function AlumniManagement() {
  // Temporary data for frontend development.
  // Later this will come from the backend API.
  const [alumni] = useState([
    {
      id: "KJ_COMP_2027_01",
      name: "Rahul Patil",
      branch: "Computer",
      year: 2027,
      status: "ACTIVE",
    },
    {
      id: "KJ_IT_2026_04",
      name: "Priya Shah",
      branch: "IT",
      year: 2026,
      status: "ACTIVE",
    },
    {
      id: "KJ_MECH_2025_12",
      name: "Amit Joshi",
      branch: "Mechanical",
      year: 2025,
      status: "SUSPENDED",
    },
  ]);

  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [passoutYear, setPassoutYear] = useState("");
  const [status, setStatus] = useState("");

  const filteredAlumni = useMemo(() => {
    return alumni.filter((alumnus) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        alumnus.id.toLowerCase().includes(searchValue) ||
        alumnus.name.toLowerCase().includes(searchValue) ||
        alumnus.branch.toLowerCase().includes(searchValue);

      const matchesBranch =
        !branch || alumnus.branch === branch;

      const matchesYear =
        !passoutYear ||
        String(alumnus.year) === passoutYear;

      const matchesStatus =
        !status || alumnus.status === status;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesYear &&
        matchesStatus
      );
    });
  }, [
    alumni,
    search,
    branch,
    passoutYear,
    status,
  ]);

  const clearFilters = () => {
    setSearch("");
    setBranch("");
    setPassoutYear("");
    setStatus("");
  };

  return (
    <div className="alumni-management-page">

      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <div className="alumni-management-header">
        <div>
          <h1>Alumni Management</h1>

          <p>
            View and manage registered alumni.
          </p>
        </div>

        <div className="alumni-count">
          {filteredAlumni.length} Alumni
        </div>
      </div>


      {/* ======================================
          FILTER BAR
      ======================================= */}

      <div className="alumni-filter-card">

        <div className="alumni-search">

          <input
            type="text"
            placeholder="Search alumni..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="alumni-filter">

          <select
            value={branch}
            onChange={(event) =>
              setBranch(event.target.value)
            }
          >
            <option value="">
              Branch
            </option>

            <option value="Computer">
              Computer
            </option>

            <option value="IT">
              IT
            </option>

            <option value="Mechanical">
              Mechanical
            </option>

            <option value="ENTC">
              ENTC
            </option>

            <option value="Civil">
              Civil
            </option>
          </select>

        </div>


        <div className="alumni-filter">

          <select
            value={passoutYear}
            onChange={(event) =>
              setPassoutYear(event.target.value)
            }
          >
            <option value="">
              Passout Year
            </option>

            <option value="2027">
              2027
            </option>

            <option value="2026">
              2026
            </option>

            <option value="2025">
              2025
            </option>

            <option value="2024">
              2024
            </option>

            <option value="2023">
              2023
            </option>
          </select>

        </div>


        <div className="alumni-filter">

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">
              Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="SUSPENDED">
              Suspended
            </option>
          </select>

        </div>


        {(search ||
          branch ||
          passoutYear ||
          status) && (
          <button
            type="button"
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>


      {/* ======================================
          ALUMNI TABLE
      ======================================= */}

      <div className="alumni-table-card">

        <div className="alumni-table-wrapper">

          <table className="alumni-table">

            <thead>

              <tr>

                <th>
                  Alumni ID
                </th>

                <th>
                  Name
                </th>

                <th>
                  Branch
                </th>

                <th>
                  Year
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredAlumni.length > 0 ? (

                filteredAlumni.map((alumnus) => (

                  <tr key={alumnus.id}>

                    <td className="alumni-id">
                      {alumnus.id}
                    </td>

                    <td className="alumni-name">
                      {alumnus.name}
                    </td>

                    <td>
                      {alumnus.branch}
                    </td>

                    <td>
                      {alumnus.year}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          alumnus.status === "ACTIVE"
                            ? "status-active"
                            : "status-suspended"
                        }`}
                      >
                        {alumnus.status}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="no-alumni"
                  >
                    No alumni found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AlumniManagement;