require("dotenv").config();
const Joi = require("joi");

const _ = require("lodash");
const { Question, validateQuestion } = require("../../models/questions");
const { User } = require("../../models/User");

const profile = async (req, res) => {
  try {
    let user = req.user;
    if (!user) return res.status(400).json({ message: "Please Login" });
    user = await User.findOne({ email: user.email });
    if (!user) return res.status(400).json({ message: "Something went Wrong" });
    let questions = await Question.find({ userId: user._id });
    // if (!questions) return res.status(200).json({ message: "No questions" ,user});
    res.status(200).json({ message: "success", user, questions });
  } catch (err) {
    res.status(400).json({ message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    let question = await Question.find();
    res.status(200).json({ message: "success", question });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postQuestions = async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const isError = validateQuestion(req.body).error;
    if (isError) {
      return res.status(400).json({ message: "Invalid Request" });
    }
    let question = new Question(
      _.pick(req.body, ["userId", "tag", "question", "description"])
    );
    await question.save();
    res
      .status(200)
      .json({ message: "question posted successfully", question });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postAnswer = async (req, res) => {
  try {
    if (!req.body.answer || !req.body.questionId)
      return res.status(400).json({ message: "please check once again" });
    req.body.userId = req.user._id;
    const { answer, questionId, userId } = req.body;
    const schema = Joi.object({ answer: Joi.string().required() });
    // const isError = schema.validate(answer).error;
    // if (isError) {
    //   return res.status(400).json({ message: "Invalid Request" });
    // }
    let question = await Question.findOne({ _id: questionId });
    if (!question)
      return res.status(400).json({ message: "Question is invalid" });
    let temp = [...question.answers, answer];
    console.log(temp);
    let updateAnswer = await Question.findOneAndUpdate(
      { _id: questionId },
      { $set: { answers: temp } },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "answer posted successfully", updateAnswer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  profile,
  getQuestions,
  postQuestions,
  postAnswer,
};
