
import { Router } from "express";
import { getAccessTokenFromRefreshToken, getUser, loginUser, logoutUser, registerUser, removeAvatar, updateAvatar, updateEmail, updateFirstname, updateLastname, updatePassword, updateUsername } from "../controllers/user.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/register").post(upload.single("avatar"),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyAuth,logoutUser)
router.route("/generateToken").post(verifyAuth,getAccessTokenFromRefreshToken)
router.route("/").get(verifyAuth,getUser)
router.route("/username").patch(verifyAuth,updateUsername)
router.route("/email").patch(verifyAuth,updateEmail)
router.route("/password").patch(verifyAuth,updatePassword)
router.route("/firstname").patch(verifyAuth,updateFirstname)
router.route("/lastname").patch(verifyAuth,updateLastname)
router.route("/avatar_url").patch(verifyAuth,upload.single("avatar"),updateAvatar)
router.route("/avatar_url").delete(verifyAuth,removeAvatar)

export default router
