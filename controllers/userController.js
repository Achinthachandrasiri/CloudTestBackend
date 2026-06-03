const User = require("../models/userModel");


// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    if (error.name === "MongoNetworkError") {
      return res.status(503).json({
        success: false,
        message: "Database connection lost. Please try again later.",
      });
    }
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    // Check if ID format is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    console.log("Received user data:", req.body);

    // Check required fields manually
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, age",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const user = await User.create({ name, email, age });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate field value: Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    // Check if ID format is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Check if body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide fields to update",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate field value: Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    // Check if ID format is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };