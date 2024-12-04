const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Jury = sequelize.define("Jury", {
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true, // Use `defaultValue` instead of `default`
    },
  });

  return Jury; // No need to explicitly define `userId` or `projectId`
};
