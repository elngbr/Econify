import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./SeeDeliverablesToGrade.css";

const SeeDeliverablesToGrade = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [gradeData, setGradeData] = useState({
    deliverableId: null,
    grade: "",
    feedback: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const response = await api.get("/deliverables/assigned");
        setDeliverables(response.data.deliverables || []);
      } catch (error) {
        console.error("Error fetching deliverables to grade:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverables();
  }, []);

  const handleEdit = (deliverable) => {
    setEditingDeliverable(deliverable.deliverableId);
    setGradeData({
      deliverableId: deliverable.deliverableId,
      grade: deliverable.grade === "No Grade" ? "" : deliverable.grade,
      feedback:
        deliverable.feedback === "No Feedback" ? "" : deliverable.feedback,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/deliverables/grade", gradeData);
      setDeliverables((prevDeliverables) =>
        prevDeliverables.map((d) =>
          d.deliverableId === gradeData.deliverableId
            ? { ...d, grade: gradeData.grade, feedback: gradeData.feedback }
            : d
        )
      );
      alert("Grade submitted successfully!");
      setEditingDeliverable(null);
      setGradeData({ deliverableId: null, grade: "", feedback: "" });
    } catch (error) {
      console.error("Error submitting grade:", error);
      alert("Failed to submit grade. Please try again.");
    }
  };

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

  if (loading) {
    return <p className="container">Loading your deliverables...</p>;
  }

  return (
    <div className="container">
      <h2 className="header">Deliverables You Have to Grade</h2>
      {deliverables.length === 0 ? (
        <p>No deliverables to grade.</p>
      ) : (
        <div>
          {currentDeliverables.map((deliverable) => (
            <div key={deliverable.deliverableId} className="deliverable-card">
              <h3 className="deliverable-title">{deliverable.title}</h3>
              <p className="deliverable-description">
                {deliverable.description || "No description provided."}
              </p>
              <p className="deliverable-info">
                Due Date: {new Date(deliverable.dueDate).toLocaleDateString()}
              </p>
              <p className="deliverable-info">
                Project: {deliverable.projectTitle}
              </p>

              <p className="deliverable-info">
                Submission Link:{" "}
                <a
                  href={deliverable.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="submission-link"
                >
                  View Submission
                </a>
              </p>
              <p className="deliverable-info">Grade: {deliverable.grade}</p>
              <p className="deliverable-info">
                Feedback: {deliverable.feedback}
              </p>

              {editingDeliverable === deliverable.deliverableId ? (
                <div className="edit-controls">
                  <input
                    type="number"
                    placeholder="Grade"
                    value={gradeData.grade}
                    onChange={(e) =>
                      setGradeData({ ...gradeData, grade: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Feedback"
                    value={gradeData.feedback}
                    onChange={(e) =>
                      setGradeData({ ...gradeData, feedback: e.target.value })
                    }
                  />
                  <button className="submit-btn" onClick={handleSubmit}>
                    Submit
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingDeliverable(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="submit-btn"
                  onClick={() => handleEdit(deliverable)}
                >
                  {deliverable.grade === "No Grade"
                    ? "Add Grade"
                    : "Edit Grade"}
                </button>
              )}
            </div>
          ))}

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeDeliverablesToGrade;
