// db/models/Student.js
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
      allowNull: true, // major cannot be null
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true, // year cannot be null
    },
    userId: {  // Foreign key that references the 'User' table
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Make sure 'Users' table is the correct name
        key: 'id',
      },
      allowNull: false,  // Ensure userId is required
    },
  });

  // Define the association with the User model
  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: "userId", as: "user" }); // Student belongs to User
  };

  return Student;
};
