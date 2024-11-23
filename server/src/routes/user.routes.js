
import { Router } from "express";
import { getAccessTokenFromRefreshToken, getUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyAuth,logoutUser)
router.route("/generateToken").post(verifyAuth,getAccessTokenFromRefreshToken)
router.route("/").get(verifyAuth,getUser)

export default router
