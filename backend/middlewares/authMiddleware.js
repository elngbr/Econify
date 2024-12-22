const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(verified.id); // Attach user to request
    if (!req.user) throw new Error();
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

// Role Check for Professors
const isProfessor = (req, res, next) => {
  if (req.user?.role !== "professor") {
    return res.status(403).json({ error: "Access restricted to professors." });
  }
  next();
};

// Role Check for Students
const isStudent = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ error: "Access restricted to students." });
  }
  next();
};

module.exports = { verifyToken, isProfessor, isStudent };
