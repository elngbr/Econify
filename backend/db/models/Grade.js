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
        min: 1,
        max: 10,
      },
    },
    feedback: {
      type: DataTypes.TEXT, // Optional feedback
      allowNull: true,
    },
  });

  Grade.associate = (models) => {
    // A grade belongs to a deliverable
    Grade.belongsTo(models.Deliverable, {
      foreignKey: "deliverableId",
      as: "deliverable",
    });

    // A grade is given by a jury member
    Grade.belongsTo(models.User, {
      foreignKey: "userId",
      as: "juryMember",
    });
  };

  return Grade;
};
