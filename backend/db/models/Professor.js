const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Professor = sequelize.define("Professor", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "Associate Professor", "Lecturer"
    },
  });

  Professor.associate = (models) => {
    Professor.belongsTo(models.User, { foreignKey: "userId", as: "user" }); // Each professor belongs to a user
  };

  return Professor;
};
