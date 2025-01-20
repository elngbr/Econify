import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ProfessorViewDeliverables = () => {
  const { teamId } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [itemsPerPage] = useState(5); // Items per page

  // Fetch deliverables for the team
  const fetchDeliverables = async () => {
    try {
      const response = await api.get(`/deliverables/team/${teamId}`);
      setDeliverables(response.data.deliverables);
    } catch (error) {
      console.error(
        "Error fetching deliverables:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch grades for a deliverable
  const fetchGrades = async (deliverableId) => {
    try {
      const response = await api.get(
        `/deliverables/${deliverableId}/professor-grades`
      );
      setGrades((prevGrades) => ({
        ...prevGrades,
        [deliverableId]: response.data.grades,
      }));
    } catch (error) {
      console.error(
        "Error fetching grades for deliverable:",
        error.response?.data || error.message
      );
    }
  };

  // Assign jury to a deliverable
  const assignJury = async (deliverableId) => {
    const jurySize = prompt("Enter the number of jurors to assign:");
    if (!jurySize || isNaN(jurySize) || parseInt(jurySize) <= 0) {
      alert("Please enter a valid number.");
      return;
    }

    try {
      const response = await api.post("/deliverables/assign-jury", {
        deliverableId,
        jurySize: parseInt(jurySize),
      });
      alert(response.data.message || "Jury assigned successfully.");

      setDeliverables((prevDeliverables) =>
        prevDeliverables.map((deliverable) =>
          deliverable.id === deliverableId
            ? { ...deliverable, isAssigned: true }
            : deliverable
        )
      );
    } catch (error) {
      console.error(
        "Error assigning jury:",
        error.response?.data || error.message
      );
      alert("Failed to assign jury. Please try again.");
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, [teamId]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliverables = deliverables.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(deliverables.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Deliverables</h1>
      {loading ? (
        <p>Loading deliverables...</p>
      ) : deliverables.length === 0 ? (
        <p>No deliverables found for this team.</p>
      ) : (
        <div>
          <ul style={styles.list}>
            {currentDeliverables.map((deliverable) => (
              <li
                key={deliverable.id}
                style={{
                  ...styles.listItem,
                  ...(deliverable.lastDeliverable && styles.lastDeliverable), // Highlight last deliverable
                }}
              >
                <h3>
                  {deliverable.title}
                  {deliverable.lastDeliverable && (
                    <span style={styles.lastLabel}> (Last Deliverable)</span>
                  )}
                </h3>
                <p>{deliverable.description}</p>
                <p>
                  Due Date: {new Date(deliverable.dueDate).toLocaleString()}
                </p>
                <p>
                  Jury Status:{" "}
                  <strong>
                    {deliverable.isAssigned
                      ? "Jury assigned."
                      : "No jury assigned."}
                  </strong>
                </p>
                {!deliverable.isAssigned && (
                  <button
                    style={styles.button}
                    onClick={() => assignJury(deliverable.id)}
                  >
                    Assign Jury
                  </button>
                )}
                <button
                  style={styles.button}
                  onClick={() => fetchGrades(deliverable.id)}
                >
                  See Grades
                </button>
                {grades[deliverable.id] &&
                  grades[deliverable.id].length > 0 && (
                    <div style={styles.gradeSection}>
                      <h4>Grades:</h4>
                      {grades[deliverable.id].map((grade, index) => (
                        <div key={index} style={styles.gradeItem}>
                          <p>Grade: {grade.grade || "Not graded yet"}</p>
                          <p>
                            Feedback: {grade.feedback || "No feedback provided"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                {grades[deliverable.id] &&
                  grades[deliverable.id].length === 0 && (
                    <p>No grades submitted yet.</p>
                  )}
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div style={styles.pagination}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  heading: { textAlign: "center", color: "#4a148c", marginBottom: "20px" },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  lastDeliverable: {
    border: "2px solid #e91e63",
    backgroundColor: "#fce4ec",
  },
  lastLabel: { color: "#e91e63", fontWeight: "bold" },
  button: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "5px",
  },
  gradeSection: { marginTop: "10px" },
  gradeItem: {
    marginBottom: "10px",
    padding: "5px",
    backgroundColor: "#f0f0f0",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  paginationButton: {
    margin: "0 10px",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: "#4a148c",
    color: "white",
  },
};

export default ProfessorViewDeliverables;
