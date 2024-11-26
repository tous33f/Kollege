
import { Router } from "express";
import { user_role } from "../middlewares/user_role.middleware.js";
import { createTags, deleteTag, getTags } from "../controllers/tag.controller.js";

let router=Router()

//post
router.route("/create").post(user_role,createTags)
router.route("/delete").post(user_role,deleteTag)

//get
router.route("/:comm_name").get(getTags)

export default router
