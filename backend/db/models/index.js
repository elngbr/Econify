// db/models/index.js
const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"), // Ensure the database file is in the correct location
});

const models = {};

// Import models
models.User = require("./User")(sequelize, Sequelize);
models.Project = require("./Project")(sequelize, Sequelize);
models.Deliverable = require("./Deliverable")(sequelize, Sequelize);
models.Grade = require("./Grade")(sequelize, Sequelize);

// Define associations (if any)
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
