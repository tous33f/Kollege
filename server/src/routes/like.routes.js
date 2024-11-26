
import { Router } from "express";
import { comment_like, getLikes, like, remove_comment_like, remove_like } from "../controllers/like.controller.js";

let router=Router()

//post
router.route("/like").post(like)
router.route("/like").patch(remove_like)
router.route("/comment_like").post(comment_like)
router.route("/comment_like").patch(remove_comment_like)

//get
router.route("/:comm_name/:post_id").get(getLikes)

export default router
