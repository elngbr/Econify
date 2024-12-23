const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Received Token:", token);

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    console.log("Authenticated User:", user);
    req.user = user; // Attach user object to the request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ error: "Invalid token." });
  }
};

// Role Check for Professors
const isProfessor = (req, res, next) => {
  console.log("User Role in isProfessor Middleware:", req.user?.role);
  if (req.user?.role !== "professor") {
    return res.status(403).json({ error: "Access denied. Professors only." });
  }
  next();
};

// Role Check for Students
const isStudent = (req, res, next) => {
  console.log("User Role in isStudent Middleware:", req.user?.role);
  if (req.user?.role !== "student") {
    return res.status(403).json({ error: "Access denied. Students only." });
  }
  next();
};

module.exports = { verifyToken, isProfessor, isStudent };
