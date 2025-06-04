const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    //Check if email already exist in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exist" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, //Asign the hashed password to password
      role,
    });

    //Save the new created user
    await newUser.save();

    //Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      "ryko_jwt_secret",
      { expiresIn: "1d" }
    );

    //Answer
    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  //Destructuring
  const { email, password } = req.body;

  try {
    //Check if email exist in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    //If the email exist, find the associated password and compare it to the user input
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    //Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "ryko_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserProfile = async (req, res) => {};

exports.updateUserProfile = async (req, res) => {};
