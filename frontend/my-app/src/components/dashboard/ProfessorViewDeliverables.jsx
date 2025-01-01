import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const ProfessorViewDeliverables = () => {
  const { teamId } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    isVisible: false,
    deliverableId: null,
    jurorCount: "",
  });

  const fetchDeliverables = async () => {
    try {
      const response = await api.get(`/deliverables/team/${teamId}`);
      setDeliverables(response.data.deliverables); // Directly use the response
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

  const openModal = (deliverableId) => {
    setModalData({
      isVisible: true,
      deliverableId,
      jurorCount: "",
    });
  };

  const closeModal = () => {
    setModalData({
      isVisible: false,
      deliverableId: null,
      jurorCount: "",
    });
  };

  const handleAssignJury = async () => {
    const { deliverableId, jurorCount } = modalData;
    if (!jurorCount || isNaN(jurorCount) || parseInt(jurorCount) <= 0) {
      alert("Please enter a valid number of jurors.");
      return;
    }

    try {
      const response = await api.post("/deliverables/assign-jury", {
        deliverableId,
        jurySize: parseInt(jurorCount),
      });
      alert(response.data.message || "Jury assigned successfully.");
      closeModal();
    } catch (error) {
      console.error(
        "Error assigning jury:",
        error.response?.data || error.message
      );
      alert("Failed to assign jury. Please try again.");
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
              <button
                style={styles.juryButton}
                onClick={() => openModal(deliverable.id)}
              >
                Assign Anonymous Jury
              </button>
            </li>
          ))}
        </ul>
      )}

      {modalData.isVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Assign Anonymous Jury</h2>
            <p>Enter the number of jurors to assign for this deliverable:</p>
            <input
              type="number"
              value={modalData.jurorCount}
              onChange={(e) =>
                setModalData({ ...modalData, jurorCount: e.target.value })
              }
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button style={styles.confirmButton} onClick={handleAssignJury}>
                Confirm
              </button>
              <button style={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
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
  link: { color: "#1e88e5", textDecoration: "underline" },
  juryButton: {
    backgroundColor: "#4a148c",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  input: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default ProfessorViewDeliverables;
