const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      default: "",
    },
    credits:
    {
      type: Number,
      default: 50,
      min: 0
    },
    isCreditsAvailable: {
      type: Boolean,
      default: true
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notes",
        default: []
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
