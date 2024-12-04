const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: False },
    email: { type: DataTypes.STIRNG, unique: true, allowNull: false },
    role: { type: DataTypes.ENUM("student", "professor"), allowNull: false },
  });

  User.associate = (models) => {
    User.hasMany(models.Project, { foreignKey: "createdBy" });
    User.belongsToMany(models.Project, {
      through: models.Jury,
      as: "Juries",
    });

    User.hasMany(models.Grade, { foreignKey: "gradedBy" });
  };

  return User;
};
