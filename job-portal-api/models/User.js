const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The username is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "The emil is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
    message: "The password is required",
  },

  role: {
    type: String,
    enum: ["admin", "recruiter", "candidate"],
    default: "admin",
    trim: true,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
