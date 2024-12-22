const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, major, year, office } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      major,
      year,
      office,
    });

    res.status(201).json({ message: "User registered successfully.", user });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials." });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  res.json(req.user); // req.user is populated by verifyToken middleware
};

// Update User
const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = req.user; // req.user is populated by verifyToken middleware

    // Update user details
    Object.assign(user, updates);
    await user.save();

    res.json({ message: "Profile updated successfully.", user });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateUser };
