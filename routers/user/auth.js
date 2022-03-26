const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  forgotPassword,
  resetPassword,
} = require("../../controller/user/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgotPassword",forgotPassword);
router.get("/resetPassword/:token",resetPassword);

module.exports = router;