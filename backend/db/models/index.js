// db/models/index.js
const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
});

const models = {};

// Importing models
models.User = require("./User")(sequelize, Sequelize);  // Ensure sequelize and Sequelize are passed in correctly
models.Project = require("./Project")(sequelize, Sequelize);
models.Deliverable = require("./Deliverable")(sequelize, Sequelize);
models.Jury = require("./Jury")(sequelize, Sequelize);
models.Grade = require("./Grade")(sequelize, Sequelize);

// Associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
