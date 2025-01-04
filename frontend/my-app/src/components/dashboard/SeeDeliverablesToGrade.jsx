import React, { useEffect, useState } from "react";
import api from "../../services/api";

const SeeDeliverablesToGrade = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [gradeData, setGradeData] = useState({
    deliverableId: null,
    grade: "",
    feedback: "",
  });

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

  if (loading) {
    return <p>Loading your deliverables...</p>;
  }

  return (
    <div>
      <h2>Deliverables You Have to Grade</h2>
      {deliverables.length === 0 ? (
        <p>No deliverables to grade.</p>
      ) : (
        <div>
          {deliverables.map((deliverable) => (
            <div key={deliverable.deliverableId}>
              <h3>{deliverable.title}</h3>
              <p>{deliverable.description}</p>
              <p>
                Due Date: {new Date(deliverable.dueDate).toLocaleDateString()}
              </p>
              <p>Project: {deliverable.projectTitle}</p>
              <p>Team: {deliverable.teamName}</p>
              <p>Professor: {deliverable.professorName}</p>
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
              <p>Grade: {deliverable.grade}</p>
              <p>Feedback: {deliverable.feedback}</p>

              {editingDeliverable === deliverable.deliverableId ? (
                <div>
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
                  <button onClick={handleSubmit}>Submit</button>
                  <button onClick={() => setEditingDeliverable(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => handleEdit(deliverable)}>
                  {deliverable.grade === "No Grade"
                    ? "Add Grade"
                    : "Edit Grade"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeDeliverablesToGrade;
