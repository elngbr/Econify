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
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users." });
  }
};
const getStudentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const students = await User.findAll({
      where: { role: "student" }, // Adjust based on your `role` field values
      include: {
        model: Team,
        where: { projectId },
      },
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students for the project." });
  }
};
const getUsersByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const users = await User.findAll({
      where: { teamId },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users for the team." });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.destroy();
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user." });
  }
};
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user; // Populated by middleware

    // Validate old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid old password." });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error updating password." });
  }
};
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await User.findAll({
      where: { role },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users by role." });
  }
};


module.exports = { registerUser, loginUser, getProfile, updateUser,getAllUsers,getStudentsByProject,getUsersByTeam ,deleteUser,changePassword,getUsersByRole};
