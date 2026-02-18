const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDb = require("./utils/connectDb");

// 1. dotenv hamesha imports se upar hona chahiye taaki controllers ko keys mil sakein
dotenv.config(); 

// 2. Ab baaki imports
const creditsRoute = require("./routes/credits.route.js");
const { stripeWebhook } = require("./controllers/credits.controller.js");

require("./models/user.model");
require("./models/notes.model");

const app = express();

// ✅ Stripe Webhook must be BEFORE express.json()
app.post("/api/credits/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.router"));
// index.js (Line 40 ke aas-paas)
app.use("/api/notes", require("./routes/generate.route.js")); // ✅ 'user.router' ki jagah 'generate.route' karo
// ✅ Fixed Variable Name: creditsRoute (Matches your import)
app.use("/api/credits", creditsRoute); 


const PORT = process.env.PORT || 5008;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log("Database connection failed", err);
});