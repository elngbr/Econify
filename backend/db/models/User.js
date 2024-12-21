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
        isIn: [["student", "professor"]], // Ensure role is either 'student' or 'professor'
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Student-specific fields
    major: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Professor-specific fields
    office: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courses: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // New fields for Team relationship
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if the student isn't part of a team yet
      references: {
        model: "Teams",
        key: "id",
      },
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: true, // Can be null if not part of a team yet
    },
  });

  User.associate = (models) => {
    // A User belongs to a Team
    User.belongsTo(models.Team, { foreignKey: "teamId", as: "team" });

    // Define relationship to Project
    User.hasMany(models.Project, {
      foreignKey: "userId",
      as: "projects",
    });
  };

  return User;
};
