
import { Router } from "express";
import { reply, getReplies, remove_reply } from "../controllers/reply.controller.js";

let router=Router()

//post
router.route("/reply").post(reply)
router.route("/reply").patch(remove_reply)

//get
router.route("/:comm_name/:comment_id").get(getReplies)

export default router
