import React, { useEffect, useState } from "react";
import api from "../../services/api";

const SeeDeliverablesToGrade = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const response = await api.get("/deliverables/assigned");
        setDeliverables(response.data.deliverables);
      } catch (error) {
        console.error("Error fetching deliverables to grade:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverables();
  }, []);

  if (loading) {
    return <p>Loading your deliverables...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Deliverables You Have to Grade</h2>
      {deliverables.length === 0 ? (
        <p>You do not have any deliverables to grade.</p>
      ) : (
        <div style={styles.deliverableList}>
          {deliverables.map((deliverable) => (
            <div key={deliverable.deliverableId} style={styles.deliverableCard}>
              <h3>{deliverable.title}</h3>
              <p>{deliverable.description}</p>
              <p>
                Due Date: {new Date(deliverable.dueDate).toLocaleDateString()}
              </p>
              <p>Project: {deliverable.projectTitle}</p>
              <p>Team: {deliverable.teamName}</p>
              <p>
                Submission Link:{" "}
                <a
                  href={deliverable.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Submission
                </a>
              </p>
              <p>Professor: {deliverable.professorId}</p>{" "}
              {/* Display professorId */}
              <button style={styles.gradeButton}>Grade This Deliverable</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    color: "#4a148c",
  },
  deliverableList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  deliverableCard: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f8f8f8",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  gradeButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SeeDeliverablesToGrade;
