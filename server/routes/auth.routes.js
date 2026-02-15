const express = require("express");
const { googleAuth } = require("../controllers/auth.controller.js");
const { logout } = require("../controllers/auth.controller.js");
const { getCurrentUser } = require("../controllers/user.controller.js");
const router = express.Router();
router.post("/google", googleAuth)
router.get("/logout", logout)
router.get("/current_user",getCurrentUser);
module.exports = router;