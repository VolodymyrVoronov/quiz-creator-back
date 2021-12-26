import mongoose from "mongoose";

import Quiz from "../models/quiz.js";

import { NETWORK_STATUS } from "../const/networkStatus.js";

export const addNewQuiz = async (req, res) => {
  const quiz = req.body;

  const newQuiz = new Quiz({ ...quiz });

  try {
    await newQuiz.save();

    res
      .status(NETWORK_STATUS.CREATED)
      .json({ message: "Quiz created successfully!" });
  } catch (error) {
    console.log(error);

    res.status(NETWORK_STATUS.CONFLICT).json({ message: error.message });
  }
};

export const fetchQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    res.status(NETWORK_STATUS.OK).json({ quizzes });
  } catch (error) {
    console.log(error);

    res
      .status(NETWORK_STATUS.INTERNAL_SEVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(NETWORK_STATUS.NOT_FOUND).send("No quiz with that id");
    }

    await Quiz.findByIdAndRemove(id);

    res
      .status(NETWORK_STATUS.OK)
      .json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(NETWORK_STATUS.NOT_FOUND).json({ message: error.message });
  }
};
