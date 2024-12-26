// db/models/Team.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define("Team", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Team.associate = (models) => {
    // A team works on a project
    Team.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });

    // A team can have multiple deliverables
    Team.hasMany(models.Deliverable, {
      foreignKey: "teamId",
      as: "deliverables",
    });

    // A team has many students (members)
    Team.hasMany(models.User, {
      foreignKey: "teamId",
      as: "students", // Alias for students
    });
  };

  return Team;
};
