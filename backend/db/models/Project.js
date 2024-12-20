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
    },
    userId: {  // Foreign key linking to the 'User' table
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Refers to the 'Users' table
        key: 'id',      // Refers to the 'id' column in the 'Users' table
      },
      allowNull: false, // Ensure userId must be provided
    },
  });

  // Define the association with the User (user can be a student or professor)
  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: 'userId', as: 'user' }); // Associate Project to User
  };

  return Project;
};
