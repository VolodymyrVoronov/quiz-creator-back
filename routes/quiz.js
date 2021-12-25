import { Router } from "express";

import { addNewQuiz } from "../controllers/quiz.js";

import protect from "./../utils/protect.js";

const router = Router();

router.post("/", protect, addNewQuiz);

export default router;
