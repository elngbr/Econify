// db/models/DeliverableJury.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DeliverableJury = sequelize.define("DeliverableJury", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Record the assignment date
    },
  });

  DeliverableJury.associate = (models) => {
    // Relationship: Many-to-Many between Deliverable and User
    DeliverableJury.belongsTo(models.Deliverable, {
      foreignKey: "deliverableId",
      as: "deliverable",
    });

    DeliverableJury.belongsTo(models.User, {
      foreignKey: "userId",
      as: "juryMember",
    });
  };

  return DeliverableJury;
};
