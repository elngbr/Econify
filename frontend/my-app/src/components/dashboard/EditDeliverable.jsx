import React, { useState } from "react";
import api from "../../services/api";

const EditDeliverable = ({ deliverable, onUpdate, onDelete, onCancel }) => {
  const [title, setTitle] = useState(deliverable.title || "");
  const [description, setDescription] = useState(deliverable.description || "");
  const [dueDate, setDueDate] = useState(
    new Date(deliverable.dueDate).toISOString().slice(0, 16) || ""
  );
  const [submissionLink, setSubmissionLink] = useState(
    deliverable.submissionLink || ""
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = async () => {
    try {
      await api.put(`/deliverables/edit/${deliverable.id}`, {
        title,
        description,
        dueDate,
        submissionLink,
      });
      onUpdate(); // Trigger parent to refresh the list
      onCancel(); // Close the edit form
    } catch (error) {
      console.error(
        "Error updating deliverable:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/deliverables/${deliverable.id}`);
      onDelete(deliverable.id); // Remove from parent state
      setShowDeleteModal(false);
    } catch (error) {
      console.error(
        "Error deleting deliverable:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Edit Deliverable</h2>
        <div style={styles.field}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div style={styles.field}>
          <label>Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label>Submission Link</label>
          <input
            type="text"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
          />
        </div>
        <div style={styles.actions}>
          <button style={styles.saveButton} onClick={handleUpdate}>
            Save Changes
          </button>
          <button
            style={styles.deleteButton}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Deliverable
          </button>
          <button style={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>

        {showDeleteModal && (
          <div style={styles.confirmModal}>
            <div style={styles.confirmContent}>
              <p>Are you sure you want to delete this deliverable?</p>
              <div style={styles.modalActions}>
                <button style={styles.confirmButton} onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button
                  style={styles.cancelButton}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
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
    width: "400px",
  },
  field: { marginBottom: "15px" },
  actions: { display: "flex", justifyContent: "space-between" },
  saveButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#616161",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  confirmModal: {
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
  confirmContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  },
  confirmButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EditDeliverable;
