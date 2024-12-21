// models/Team.js
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
    // A Team belongs to a Project
    Team.belongsTo(models.Project, { foreignKey: "projectId", as: "project" });

    // A Team has many Students
    Team.hasMany(models.User, { foreignKey: "teamId", as: "students" });
  };

  return Team;
};
