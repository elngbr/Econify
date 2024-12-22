// db/models/Deliverable.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Deliverable = sequelize.define("Deliverable", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    submissionLink: {
      type: DataTypes.STRING, // Link to the submitted deliverable
      allowNull: true,
    },
  });

  Deliverable.associate = (models) => {
    // A deliverable belongs to a team
    Deliverable.belongsTo(models.Team, {
      foreignKey: "teamId",
      as: "team",
    });

    // A deliverable has many grades (from jury members)
    Deliverable.hasMany(models.Grade, {
      foreignKey: "deliverableId",
      as: "grades",
    });

    // A deliverable has many jury members (students assigned to grade it)
    Deliverable.belongsToMany(models.User, {
      through: "DeliverableJury",
      as: "juryMembers",
      foreignKey: "deliverableId",
    });
    // Deliverable.belongsTo(models.Project, { foreignKey: "projectId", as: "project" });
  };

  return Deliverable;
};
