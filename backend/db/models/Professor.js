// db/models/Project.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Project = sequelize.define("Project", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    studentId: { // Foreign key linking to the User table
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Refers to the 'Users' table
        key: 'id', // Refers to the 'id' column in the 'Users' table
      },
      allowNull: false, // Ensures studentId must be present
    },
  });

  // Define the association with the User (student)
  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' }); // Associate Project to User as 'student'
  };

  return Project;
};
