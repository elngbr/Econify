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
      type: DataTypes.STRING, // Store the link as a string
      allowNull: true, // Optional field
      validate: {
        isUrl: true, // Sequelize built-in URL validation
      },
    },
    released: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastDeliverable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to false
    },
    isAssigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to false (not assigned)
    },
  });

  Deliverable.associate = (models) => {
    Deliverable.belongsTo(models.Team, { foreignKey: "teamId", as: "team" });
    Deliverable.hasMany(models.Grade, {
      foreignKey: "deliverableId",
      as: "grades",
    });
    Deliverable.belongsToMany(models.User, {
      through: "DeliverableJury",
      as: "juryMembers",
      foreignKey: "deliverableId",
    });
  };

  return Deliverable;
};
