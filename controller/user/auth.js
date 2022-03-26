require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User, validateUser } = require("../../models/User");
const sendEmail = require("../../utils/sendEmail");
// const mongoose = require("mongoose");
const _ = require("lodash");

//signup controller
const signup = async (req, res) => {
  try {
    const isError = validateUser(req.body).error;
    if (isError) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body, ["username", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    console.log(token);
    console.log(user);

    res
      .header("x-auth-token", token)
      .status(200)
      .json({ message: "created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message || "SignUp Failed" });
  }
};

//login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Enter all Data" });

    const { error } = validate(req.body);
    if (error) return res.status(400).send("Enter the data properly");

    let user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).send("Invalid username");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ _id: user._id ,username:user.username,email:user.email}, process.env.JWT_PRIVATE_KEY);

    const response = {
      status: "Logged in",
      accessToken: token,
    };

    res
      .header("x-auth-token", token)
      .status(200)
      .json({ message: "Login Successful", response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//forgot password controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).send("Invalid username");

    const token = jwt.sign({ _id: user._id ,username:user.username,email:user.email}, process.env.JWT_PRIVATE_KEY);

    const link = `${process.env.BASE_URL}/resetPassword/${token}`;
    await sendEmail(user.email, "Password reset", link);

    res
      .status(200)
      .json({ message: "password reset link sent to your email account" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//reset password controller
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const schema = Joi.object({
      password: Joi.string().min(3).max(30).required(),
    });
    const { error } = schema.validate(req.body);
    console.log(token);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    if (!user)
      return res.status(400).json({ message: "Invalid link or expired" });

    user = JSON.parse(user);
    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);

    user = await User.findOne({email:user.email});
    if(!user) return res.status(400).json({ message: "Unknown user" })

    user.password = password;
    user = await user.save();

    if (!user)
      return res.status(500).json({ message: "Something went wrong" });

    res.status(200).json({ message: "password reset successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = {
  login,
  signup,
  forgotPassword,
  resetPassword
};
