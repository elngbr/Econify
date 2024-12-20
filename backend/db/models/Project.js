// db/models/Project.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Project = sequelize.define("Project", {
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
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users", // This should reference the 'Users' table
        key: "id",      // The key in the 'Users' table
      },
      allowNull: false, // Ensure every project must be linked to a user
    },
  });

  // Define the association with the User model
  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: "userId", as: "user" }); // A Project belongs to a User
  };

  return Project;
};
