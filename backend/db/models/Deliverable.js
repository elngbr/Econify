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
      type: DataTypes.STRING, // Optional link to submitted deliverable
    },
  });

  Deliverable.associate = (models) => {
    Deliverable.belongsTo(models.Project, { foreignKey: "projectId", as: "project" });
    Deliverable.hasMany(models.Grade, { foreignKey: "deliverableId", as: "grades" });
    Deliverable.belongsToMany(models.User, { through: "DeliverableJury", as: "juryMembers" }); // Anonymous jury
  };

  return Deliverable;
};
