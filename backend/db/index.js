const { Sequelize } = require("sequelzie");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
});

const models = {};

//Importing the models from the root directory...here we gather them
models.User = require("./models/User");
models.Project = require("./models/Project");
models.Deliverable = require("./models/Deliverable");
models.Jury = require("./models/Jury");
models.Grade = require("./models/Grade");

//Now we have to associate the models...
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize=sequelize;
models.Sequelize=Sequelize;

module.exports=models;