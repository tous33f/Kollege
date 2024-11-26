
import { Router } from "express";
import { comment, getComments, remove_comment } from "../controllers/comment.controller.js";

let router=Router()

//post
router.route("/comment").post(comment)
router.route("/comment").patch(remove_comment)

//get
router.route("/:comm_name/:post_id").get(getComments)

export default router
