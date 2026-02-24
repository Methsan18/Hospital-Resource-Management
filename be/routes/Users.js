const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const VALID_ROLES = [
  "pharmacist",
  "etu_head",
  "store_manager",
  "ward_nurse",
  "etu_nurse",
  "etu_doc",
  "opd_doc",
  "patient",
  "methaRole",
  "admin"
];


// 🔹 REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { username,
      email,
      password,
      role,
      firstName,
      lastName,
      mobile,
      address } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      mobile,
      address
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


// 🔹 GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// 🔹 GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// 🔹 UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.role && !VALID_ROLES.includes(updateData.role)) {
      return res.status(400).json({ message: "Invalid user role" });
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// 🔹 DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

/*
{
  "username": "admin01",
  "email": "admin01@test.com",
  "password": "Admin@123",
  "role": "admin"
}

*/