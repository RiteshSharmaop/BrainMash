import { Router } from "express";
import { handlePrompt } from "../controller/handlePrompt.controller.js";
const router = Router();


router.route("/").post(handlePrompt);
// router.route("/multillm").post(multiLLM);


export default router;
