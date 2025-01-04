import React, { useEffect, useState } from "react";
import api from "../../services/api";

const ViewMembers = ({ teamId, userRole }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState({
    isVisible: false,
    memberId: null,
    memberName: "",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get(`/teams/${teamId}/members`);
        setMembers(response.data.members || []);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  const openModal = (userId, userName) => {
    setModalData({
      isVisible: true,
      memberId: userId,
      memberName: userName,
    });
  };

  const closeModal = () => {
    setModalData({
      isVisible: false,
      memberId: null,
      memberName: "",
    });
  };
  const handleRemoveMember = async () => {
    try {
      await api.post("/teams/remove-user", {
        teamId,
        userId: modalData.memberId,
      });
      setMembers(members.filter((member) => member.id !== modalData.memberId));
      alert(`User "${modalData.memberName}" removed successfully.`);
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user.");
    } finally {
      closeModal();
    }
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3 style={styles.heading}>Team Members</h3>
      {members.length === 0 ? (
        <p style={styles.noMembers}>No members in this team.</p>
      ) : (
        <ul style={styles.memberList}>
          {members.map((member) => (
            <li key={member.id} style={styles.memberItem}>
              {member.name} ({member.email})
              {userRole === "professor" && (
                <button
                  style={styles.removeButton}
                  onClick={() => openModal(member.id, member.name)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {modalData.isVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p>
              Are you sure you want to remove "{modalData.memberName}" from the
              team?
            </p>
            <div style={styles.modalActions}>
              <button style={styles.confirmButton} onClick={handleRemoveMember}>
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
  heading: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#4a148c",
    marginBottom: "10px",
  },
  noMembers: {
    fontStyle: "italic",
    color: "#616161",
  },
  memberList: {
    listStyleType: "none",
    padding: 0,
  },
  memberItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #d1c4e9",
  },
  removeButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
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
    justifyContent: "space-around",
    marginTop: "10px",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ViewMembers;
