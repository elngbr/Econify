// db/models/User.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["student", "professor"]], // Only 'student' or 'professor' roles allowed
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Additional fields for professors
    office: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courses: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Additional fields for students
    major: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    // Professors can create projects
    User.hasMany(models.Project, {
      foreignKey: "userId",
      as: "projects",
    });

    // Students belong to a team
    User.belongsTo(models.Team, {
      foreignKey: "teamId",
      as: "team",
    });

    // Students can act as jurors for deliverables
    User.belongsToMany(models.Deliverable, {
      through: "DeliverableJury",
      as: "juryDeliverables",
      foreignKey: "userId",
    });
  };

  return User;
};
