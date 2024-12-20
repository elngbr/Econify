// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db/models"); // Import sequelize from models

// Import the user routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const deliverableRoutes = require("./routes/deliverableRoutes");
const gradeRoutes = require("./routes/gradeRoutes");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set up user routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deliverables", deliverableRoutes);
app.use("/api/grades", gradeRoutes);

// Test database connection and sync
(async () => {
  try {
    await sequelize.authenticate(); // Check if database connection works
    console.log("Database connected!");

    // Force sync (this will drop existing tables and recreate them)
    await sequelize.sync({ force: false});
    console.log("Database synced!");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
})();
