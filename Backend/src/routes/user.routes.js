import { Router } from "express";
import {
    userRegister,
    // userLogin,
    // getUser,
    // forgetPassword
} from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(userRegister);
// router.route("/login").post(userLogin);
// router.route("/me").get(getUser);
// router.route("/forgot-password").post(forgetPassword);


export default router;
