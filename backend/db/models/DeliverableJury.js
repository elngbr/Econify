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
      type: DataTypes.STRING, // Optional link to submitted deliverable
    },
  });

  Deliverable.associate = (models) => {
    // A deliverable belongs to a project
    Deliverable.belongsTo(models.Project, { foreignKey: "projectId", as: "project" });

    // A deliverable has many grades (from the jury)
    Deliverable.hasMany(models.Grade, { foreignKey: "deliverableId", as: "grades" });

    // A deliverable has many jury members (students assigned to grade it)
    Deliverable.belongsToMany(models.User, { 
      through: "DeliverableJury", 
      as: "juryMembers",
      foreignKey: "deliverableId",
    });
  };

  return Deliverable;
};
