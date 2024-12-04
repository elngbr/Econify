const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Jury = sequelize.define("Jury", {
    isActive: { type: DataTypes.BOOLEAN, default: true },
  });

  Jury.associate = (models) => {
    Jury.belongsTo(models.User, { foreignKey: "userId" });
    Jury.belongsTo(models.Project, { foreignKey: "projectId" });
  };

  return Jury;
};
