import { Router } from "express";
import { authUser } from "../middleware/auth.middelware.js";
import { payment } from "../controller/payment.controller.js";
const router = Router();

router.route("/create-checkout-session").post( payment);


export default router;
