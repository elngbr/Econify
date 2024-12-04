const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Grade = sequelize.define("Grade", {
    score: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
  });

  Grade.associate = (models) => {
    Grade.belongsTo(models.User, { foreignKey: "gradedBy", as: "Grader" });
    Grade.belongsTo(models.Project, { foreignKey: "projectId" });
  };

  return Grade;
};
