
import { Router } from "express";
import { getMessagedUsers, getMessages, sendMessage } from "../controllers/chat.controller.js";

let router=Router()

router.route("/:user_id").get(getMessages)
router.route("/").get(getMessagedUsers)
router.route("/").post(sendMessage)

export default router
