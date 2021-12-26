import mongoose from "mongoose";

const quizSchema = mongoose.Schema(
  { __v: { type: Number, select: false } },
  {
    id: { type: String, required: true },
    quizTitle: { type: String, required: true },
    userId: { type: String, required: true },

    questions: [
      {
        id: { type: String, required: true },
        question: { type: String, required: true },
        options: [
          {
            id: { type: String, required: true },
            answerOption: { type: String, required: true },
            correct: { type: Boolean, required: true },
            userAnswer: { type: Boolean, required: true },
          },
        ],
      },
    ],
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
