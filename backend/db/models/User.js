// db/models/User.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['student', 'professor']], // Ensure role is either 'student' or 'professor'
      },
    },
    // Common fields (applicable for both student and professor)
    department: {
      type: DataTypes.STRING,
      allowNull: true, // Can be null for students if not applicable
    },
    // Student-specific fields
    major: {
      type: DataTypes.STRING,
      allowNull: true, // Major can be null for professors
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true, // Year can be null for professors
    },
    // Professor-specific fields
    office: {
      type: DataTypes.STRING,
      allowNull: true, // Office can be null for students
    },
    courses: {
      type: DataTypes.TEXT,
      allowNull: true, // Courses can be null for students
    },
  });

  return User;
};
