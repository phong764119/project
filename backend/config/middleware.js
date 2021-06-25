const { SECRET } = require("./server");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Err = require("../models/errorLog");
const env = process.env.NODE_ENV || "dev";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  Err.create({
    url: req.url,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env === "dev" ? err.stack : null,
  });
};

const protectRoute = async (req, res, next) => {
  let pass = false;
  try {
    if (req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer")) {
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], SECRET);
        if (await User.findById(decoded._id).select("_id").exec()) {
          req.user = decoded;
          pass = true;
          next();
        }
      }
    }
  } catch (error) {
    res.status(401);
    console.error(error);
    next(new Error("not.authorized"));
  }

  if (!pass) {
    res.status(401);
    next(new Error("not.authorized"));
  }
};

const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("not.admin");
  }
};

module.exports = { notFound, errorHandler, protectRoute, adminRoute };
