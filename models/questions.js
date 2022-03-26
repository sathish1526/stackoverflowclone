const Joi = require("joi");
const array = require("joi/lib/types/array");
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150
  },
  tag: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  question: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  description: {
    type: String,
    required: true,
    minlength: 5
  }, 
  answers: {
    type: [String],
    required: true,
    default: []

  }
});

const Question = mongoose.model('Question', questionSchema);

function validateQuestion(question) {
  const schema = {
    userId: Joi.string().required(),
    tag: Joi.string().min(2).max(255).required(),
    question: Joi.string().min(5).max(1024).required(),
    description:Joi.string().min(5).required(),
    answers:Joi.array()
  };
  return Joi.validate(question, schema);
}

module.exports = {
    Question,
    validateQuestion
}

// exports.User = User; 
// exports.validate = validateUser;
