const Joi = require("joi");

// const schema = Joi.object({
//   userName: Joi.string().min(3).max(30).required(),
//   password: Joi.string().min(3).max(30).required(),
//   repeat_password: Joi.ref("password"),
//   phone: Joi.string().min(10).max(15).required(),
//   email: Joi.string().required()
// });

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id ,username:this.username,email:this.email}, process.env.JWT_PRIVATE_KEY);
  return token;
}
userSchema.methods.verifyAuthToken = function(token){
  const decode = jwt.verify(token,config.get('jwtPrivateKey'));
  console.log(decode);
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

module.exports = {
    User,
    validateUser
}

// exports.User = User; 
// exports.validate = validateUser;
