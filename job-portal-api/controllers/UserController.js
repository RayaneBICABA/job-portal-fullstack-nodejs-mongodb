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

exports.getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the JWT payload (req.user is set by auth middleware)
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "User profile fetched successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update fields only if new values are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      msg: "User profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
