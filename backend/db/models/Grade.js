// db/models/Grade.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Grade = sequelize.define("Grade", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
  });

  Grade.associate = (models) => {
    Grade.belongsTo(models.Deliverable, { foreignKey: "deliverableId", as: "deliverable" });
    Grade.belongsTo(models.User, { foreignKey: "juryId", as: "jury" });
  };

  return Grade;
};
