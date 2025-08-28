import { Router } from "express";
import { authUser } from "../middleware/auth.middelware.js";
import { handlePrompt } from "../controller/handlePrompt.controller.js";
const router = Router();


router.route("/").post( authUser , handlePrompt);
// router.route("/multillm").post(multiLLM);


export default router;
