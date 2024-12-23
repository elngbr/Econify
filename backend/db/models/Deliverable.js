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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    submissionLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    released: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Grades are not released by default
    },
  });

  Deliverable.associate = (models) => {
    Deliverable.belongsTo(models.Team, { foreignKey: "teamId", as: "team" });
    Deliverable.hasMany(models.Grade, { foreignKey: "deliverableId", as: "grades" });
    Deliverable.belongsToMany(models.User, {
      through: "DeliverableJury",
      as: "juryMembers",
      foreignKey: "deliverableId",
    });
  };

  return Deliverable;
};
