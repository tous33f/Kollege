import { Router } from "express";
import { createVideo, deleteVideo, getAllVideos, getVideo } from "../controllers/video.controller.js";

const router=Router()

//post
router.route("/create").post(createVideo)
router.route("/delete").post(deleteVideo)

//get
router.route("/:comm_name/:course_id/:video_id").get(getVideo)
router.route("/:comm_name/:course_id").get(getAllVideos)

export default router
