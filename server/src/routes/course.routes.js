import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createCourse,deleteCourse,getAllCourses,getCourse } from "../controllers/course.controller.js";

const router=Router()

//post
router.route("/create").post(upload.single("banner_url"),createCourse)
router.route("/delete").post(deleteCourse)

//get
router.route("/:comm_name/:course_id").get(getCourse)
router.route("/:comm_name").get(getAllCourses)

export default router
