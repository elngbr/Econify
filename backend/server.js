const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./db/models"); // Import sequelize from models
const cors = require("cors");

// Import the user routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const deliverableRoutes = require("./routes/deliverableRoutes");
const gradeRoutes = require("./routes/gradeRoutes");


const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors());

// Set up routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/deliverables", deliverableRoutes);
app.use("/api/grades", gradeRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Test database connection and sync
(async () => {
  try {
    await sequelize.authenticate(); // Check if database connection works
    console.log("Database connected!");

    // Sync database
    await sequelize.sync({ force: false }); // Set to `true` to recreate tables on every run
    console.log("Database synced!");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
})();
