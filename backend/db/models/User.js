// db/models/User.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    role: { type: DataTypes.ENUM("STUDENT", "PROFESSOR"), allowNull: false },
  });

  User.associate = (models) => {
    // Add associations
    User.hasMany(models.Project, { foreignKey: "createdBy" });
    User.belongsToMany(models.Project, { through: models.Jury, as: "Juries" });
    User.hasMany(models.Grade, { foreignKey: "gradedBy" });
  };

  return User;
};
