
import { Router } from "express";
import { createPost, deletePost, getAllPosts, getPost, updateContent, updateTag, updateTitle } from "../controllers/post.controller.js";
import { user_role } from "../middlewares/user_role.middleware.js";

let router=Router()

//post
router.route("/create").post(createPost)
router.route("/delete").post(user_role,deletePost)
router.route("/update_title").post(updateTitle)
router.route("/update_content").post(updateContent)
router.route("/update_tag").post(updateTag)

//get
router.route("/:comm_name/:post_id").get(getPost)
router.route("/:comm_name").get(getAllPosts)

export default router
