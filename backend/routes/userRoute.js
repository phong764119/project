const express = require("express");
const { authUser, registerUser, updateUserProfile } = require("../controllers/userController");
const { protectRoute } = require("../config/middleware");

const router = express.Router();

router.route("/").post(protectRoute, registerUser);
router.route("/login").post(authUser);
router.route("/profile").put(protectRoute, updateUserProfile);

module.exports = router;
