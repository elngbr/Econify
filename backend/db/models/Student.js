const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Student = sequelize.define("Student", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    major: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: "userId", as: "user" }); // Each student belongs to a user
  };

  return Student;
};
