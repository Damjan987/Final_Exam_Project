const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/keys");

exports.signupController = async (req, res) => {
  const { firstname, lastname, username, email, birthday, gender, password } = req.body;

  console.log("-------------------------------------");
  console.log(gender);
  console.log("-------------------------------------");

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errorMessage: "Email already exists",
      });
    }

    const newUser = new User();
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.username = username;
    newUser.email = email;
    newUser.birthday = birthday;
    newUser.isBanned = false;
    newUser.status = "";
    // TODO: change gender select input on frontend and this
    //       so it is no longer hard-coded like this
    newUser.gender = gender;

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    res.json({ successMessage: "Registration success. Please signin." });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Server error",
    });
  }
};

exports.signinController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errorMessage: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errorMessage: "Invalid credentials",
      });
    }

    const payload = {
      user: {
        _id: user._id,
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire }, (err, token) => {
      const { _id, username, email, role } = user;
      res.json({
        token,
        user: { _id, username, email, role },
      });
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Server error",
    });
  }
};


exports.readAll = async (req, res) => {
  try {
    const users = await User.find({ "role": { _id: 0 } });

    users.forEach(user => {
      if (user.role !== 0) {
        users.remove(user);
      }
    })

    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(500).json({
      errorMessage: "Please try again later",
    });
  }
};