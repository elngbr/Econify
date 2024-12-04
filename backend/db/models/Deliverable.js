const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Deliverable = sequelize.define("Deliverable", {
    name: { type: DataTypes.STRING, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    videoUrl: { type: DataTypes.STRING, allowNull: true },
  });

  Deliverable.associate=(models)=>{
    Deliverable.belongsTo(models.Project,{foreignKey:"projectId"});

  }

  return Deliverable;
};
