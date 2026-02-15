// routes/user.router.js
const express = require("express");
const Userrouter = express.Router();

// 1. Check karein ki isAuth function sahi se aa raha hai
const isAuth = require("../middleware/isAuth"); 

// 2. Yahan {} lagana bahut zaroori hai kyunki controller se object export hua hai
const { getCurrentUser } = require("../controllers/user.controller");

// Debug karne ke liye ye do lines add karein (Sirf test ke liye)
console.log("isAuth type:", typeof isAuth); 
console.log("getCurrentUser type:", typeof getCurrentUser);

// Line 6: Ensure karein ki dono functions hain
Userrouter.get("/currentuser", isAuth, getCurrentUser);

module.exports = Userrouter;