import { Router } from "express";
import { authUser } from "../middleware/auth.middelware.js";
import { payment } from "../controller/payment.controller.js";
const router = Router();

console.log("Payment route loaded");

router.route("/create-checkout-session").post(authUser, payment);



export default router;
