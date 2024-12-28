import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import EditDeliverable from "./EditDeliverable";

const ViewDeliverables = () => {
  const { teamId } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);

  const fetchDeliverables = async () => {
    try {
      const response = await api.get(`/deliverables/team/${teamId}`);
      setDeliverables(response.data.deliverables || []);
    } catch (error) {
      console.error(
        "Error fetching deliverables:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, [teamId]);

  const handleEdit = (deliverable) => {
    setSelectedDeliverable(deliverable);
  };

  const handleDeleteFromState = (deletedId) => {
    setDeliverables((prevDeliverables) =>
      prevDeliverables.filter((deliverable) => deliverable.id !== deletedId)
    );
  };

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
            <li
              key={deliverable.id}
              style={{
                ...styles.listItem,
                backgroundColor: deliverable.lastDeliverable
                  ? "#fce4ec"
                  : "#fff",
              }}
            >
              <h3>
                {deliverable.title}
                {deliverable.lastDeliverable && " (Last Deliverable)"}
              </h3>
              <p>{deliverable.description}</p>
              <p>Due Date: {new Date(deliverable.dueDate).toLocaleString()}</p>
              {deliverable.submissionLink && (
                <p>
                  <a
                    href={deliverable.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    View Submission
                  </a>
                </p>
              )}
              {new Date() < new Date(deliverable.dueDate) ? (
                <button
                  style={styles.editButton}
                  onClick={() => handleEdit(deliverable)}
                >
                  Edit/Delete
                </button>
              ) : (
                <p style={styles.passedMessage}>Editing Time Passed</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {selectedDeliverable && (
        <EditDeliverable
          deliverable={selectedDeliverable}
          onUpdate={fetchDeliverables}
          onDelete={handleDeleteFromState}
          onCancel={() => setSelectedDeliverable(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  heading: { textAlign: "center", color: "#4a148c", marginBottom: "20px" },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  editButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  passedMessage: { color: "red", fontStyle: "italic" },
  link: { color: "#1e88e5", textDecoration: "underline" },
};

export default ViewDeliverables;
