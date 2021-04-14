const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/server");

const generateToken = (obj) => {
  return jwt.sign(obj, SECRET, {
    expiresIn: "1d",
  });
};

const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    var obj = {
      _id: user._id,
      user_level: user.user_level,
    };
    res.json({
      id: user._id,
      user_level: user.user_level,
      username: username,
      full_name: user.full_name,
      token: generateToken(obj),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, user_level, full_name } = req.body;
  const userExists = await User.findOne({ username }).exec();
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ username, password, user_level, full_name });
  var obj = {
    _id: user._id,
    user_level: user.user_level,
  };
  res.json({
    id: user._id,
    user_level: user.user_level,
    username: username,
    full_name: user.full_name,
    token: generateToken(obj),
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  if (user) {
    user.full_name = req.body.full_name || user.full_name;

    if (req.body.username) {
      var e = await User.findOne({ username: req.body.username }).exec();
      if (e) {
        res.status(400);
        throw new Error("Email is already exist");
      } else user.username = req.body.username;
    }

    if (req.body.password) {
      if (await user.matchPassword(req.body.oldPassword)) user.password = req.body.password;
      else {
        res.status(400);
        throw new Error("Wrong password");
      }
    }
    await user.save();
    res.json({ success: true });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = { authUser, registerUser, updateUserProfile };
