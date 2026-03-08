const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    // Cookie se lo, ya Authorization Header se backup lo
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token found!" });
    }
    // ... baaki logic same

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    // 🔥 YAHAN IMPORTANT FIX
    req.userId = decoded.userId;

    console.log("👉 req.userId set to:", req.userId);

    next();

  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAuth;
