const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const { createCreditsOrder } = require("../controllers/credits.controller");

// Main path: /api/credits/purchase
router.post("/purchase", isAuth, createCreditsOrder);

module.exports = router;