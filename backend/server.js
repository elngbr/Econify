const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db/models"); //we import the sequalize instance from the db
const userRoutes = require("./routes/userRoutes");
// const projectRoutes = require("./routes/projectRoutes");
// const deliverableRoutes = require("./routes/deliverableRoutes");
// const juryRoutes = require("./routes/juryRoutes");
// const gradeRoutes = require("./routes/gradeRoutes");

const app = express();
const PORT = 3000;

// //We do use the middleware
// app.use(express.json());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/deliverables", deliverableRoutes);
// app.use("/api/jury", juryRoutes);
// app.use("/api/grades", gradeRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error(
      "There's an error in trying to connect to the database:",
      err
    );
  }
})();

//Always listen too the port
(async () => {
    try {
      // Sync the models with the database
      await sequelize.sync({ force: true }); // This will drop and recreate the tables. (Use with caution)
      console.log("Database synced successfully!");
  
      // Test database connection
      await sequelize.authenticate();
      console.log("Database connected!");
  
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}.`);
      });
  
    } catch (err) {
      console.error("Error syncing database or connecting:", err);
    }
  })();