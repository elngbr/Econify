// db/models/Grade.js
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
        // Ensure that grade is returned with 2 decimal places
        const value = this.getDataValue('grade');
        return value !== null ? value.toFixed(2) : null;
      },
      set(value) {
        // Ensure grade is stored with 2 decimal places and within range
        if (value >= 1 && value <= 10) {
          this.setDataValue('grade', parseFloat(value).toFixed(2));
        } else {
          throw new Error("Grade must be between 1 and 10");
        }
      }
    },
    feedback: {
      type: DataTypes.TEXT, // Optional feedback for the deliverable
    },
  });

  Grade.associate = (models) => {
    // Grade belongs to a deliverable (a specific deliverable being graded)
    Grade.belongsTo(models.Deliverable, { foreignKey: "deliverableId", as: "deliverable" });

    // Grade is submitted by a jury member (student)
    Grade.belongsTo(models.User, { foreignKey: "userId", as: "juryMember" }); // User is the student in the jury
  };

  return Grade;
};
