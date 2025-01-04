import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ProfessorViewDeliverables = () => {
  const { teamId } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({}); // Store grades for each deliverable

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

  const fetchGrades = async (deliverableId) => {
    try {
      const response = await api.get(
        `/deliverables/${deliverableId}/professor-grades`
      );
      console.log(
        "Grades fetched for deliverable:",
        deliverableId,
        response.data.grades
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

      // Update deliverable's isAssigned status
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

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Deliverables</h1>
      {loading ? (
        <p>Loading deliverables...</p>
      ) : deliverables.length === 0 ? (
        <p>No deliverables found for this team.</p>
      ) : (
        <ul style={styles.list}>
          {deliverables.map((deliverable) => (
            <li key={deliverable.id} style={styles.listItem}>
              <h3>{deliverable.title}</h3>
              <p>{deliverable.description}</p>
              <p>Due Date: {new Date(deliverable.dueDate).toLocaleString()}</p>

              {/* Display jury status */}
              <p>
                Jury Status:{" "}
                <strong>
                  {deliverable.isAssigned
                    ? "It has been assigned a jury."
                    : "It has not been assigned a jury."}
                </strong>
              </p>

              {/* Conditionally render Assign Jury Button */}
              {!deliverable.isAssigned && (
                <button
                  style={styles.button}
                  onClick={() => assignJury(deliverable.id)}
                >
                  Assign Jury
                </button>
              )}

              {/* See Grades Button */}
              <button
                style={styles.button}
                onClick={() => fetchGrades(deliverable.id)}
              >
                See Grades
              </button>

              {/* Show grades if available */}
              {grades[deliverable.id] && grades[deliverable.id].length > 0 && (
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

              {/* Show message if grades are not available */}
              {grades[deliverable.id] &&
                grades[deliverable.id].length === 0 && (
                  <p>No grades submitted yet.</p>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  heading: { textAlign: "center", color: "#4a148c", marginBottom: "20px" },
  list: { listStyle: "none", padding: 0 },
  listItem: { marginBottom: "15px", padding: "15px", border: "1px solid #ccc" },
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
};

export default ProfessorViewDeliverables;
