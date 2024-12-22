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
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false, // Only professors can create projects
    },
  });

  Project.associate = (models) => {
    // A project belongs to a professor
    Project.belongsTo(models.User, {
      foreignKey: "userId",
      as: "professor",
    });

    // A project has many teams
    Project.hasMany(models.Team, {
      foreignKey: "projectId",
      as: "teams",
    });

    // A project has many deliverables (indirectly through teams)
    Project.hasMany(models.Deliverable, {
      foreignKey: "projectId",
      as: "deliverables",
    });
  };

  return Project;
};
