const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Project = sequelize.define("Project", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: "createdBy", as: "Owner" });
    Project.hasMany(models.Deliverable, { foreignKey: "projectId" });
    Project.hasMany(models.Grade, { foreignKey: "projectId" });
    Project.belongsToMany(models.User, {
      through: models.Jury,
      as: "Jurors",
    });
  };

  return Project;
};
