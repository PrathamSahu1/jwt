const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const router = express.Router();
const db = require('../models/index');
const { ApiError } = require("../utils/apiError");
const {ApiResponse} = require('../utils/apiResponse')
const User = require('../models/user')(db.sequelize,db.Sequelize.DataTypes);


// register route
router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }
  
      // Create new user
      const newUser = await User.create({ name, email, password });
  
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
})

//login route
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if(!email){
        throw new ApiError(400,"email is required")
      }

      const user = await User.findOne({ where: { email } });
  
      if (!user || !(await user.checkPassword(password))) {
        throw new ApiError(404, "invalid email or password")
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
  

      
      res
      .status(200)
      .cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "strict" })
      .json(new ApiResponse(200,{name:user.name,email:user.email},"Successfully logged In"));



    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message});
    }
  });

  module.exports = router;
