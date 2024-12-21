const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Grade = sequelize.define("Grade", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grade: {
      type: DataTypes.FLOAT,
      allowNull: true, // Grades can be null initially
      validate: {
        min: 1, // Grade must be >= 1
        max: 10, // Grade must be <= 10
      },
      get() {
        const value = this.getDataValue("grade");
        return value !== null ? value.toFixed(2) : null;
      },
      set(value) {
        if (value >= 1 && value <= 10) {
          this.setDataValue("grade", parseFloat(value).toFixed(2));
        } else {
          throw new Error("Grade must be between 1 and 10");
        }
      },
    },
    feedback: {
      type: DataTypes.TEXT, // Optional feedback for the deliverable
    },
  });

  Grade.associate = (models) => {
    Grade.belongsTo(models.Deliverable, { foreignKey: "deliverableId", as: "deliverable" });
    Grade.belongsTo(models.User, { foreignKey: "userId", as: "juryMember" }); // User is the student in the jury
  };

  // Helper method to calculate the average grade for a deliverable
  Grade.getAverageGradeForDeliverable = async (deliverableId) => {
    const grades = await Grade.findAll({ where: { deliverableId } });
    if (grades.length === 0) return null;
    const sum = grades.reduce((acc, grade) => acc + parseFloat(grade.grade), 0);
    return (sum / grades.length).toFixed(2);
  };

  return Grade;
};
