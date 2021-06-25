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
      role: user.role,
    };
    res.json({
      id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      points: user.points,
      confirmed: user.confirmed,
      token: generateToken(obj),
    });
  } else {
    res.status(401);
    throw new Error("invalid.login");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email, fullName, phone } = req.body;
  const userExists = await User.findOne({ username }).exec();
  if (userExists) {
    res.status(400);
    throw new Error("user.existing");
  }

  const user = await User.create({ username, password, email, fullName, phone });
  var obj = {
    _id: user._id,
    role: user.role,
  };
  res.json({
    id: user._id,
    role: user.role,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    points: user.points,
    confirmed: user.confirmed,
    token: generateToken(obj),
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  if (user) {
    user.fullName = req.body.fullName || user.fullName;

    if (req.body.email) {
      var e = await User.findOne({ username: req.body.email }).exec();
      if (e) {
        res.status(400);
        throw new Error("email.existing");
      } else user.email = req.body.email;
    }

    if (req.body.password) {
      if (await user.matchPassword(req.body.oldPassword)) user.password = req.body.password;
      else {
        res.status(400);
        throw new Error("wrong.password");
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
