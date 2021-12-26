import { Router } from "express";

import { addNewQuiz, fetchQuizzes, deleteQuiz } from "../controllers/quiz.js";

import protect from "./../utils/protect.js";

const router = Router();

// /quiz
router.route("/").get(fetchQuizzes).post(protect, addNewQuiz);

// /quiz/:id
router.route("/:id").delete(protect, deleteQuiz);

export default router;
