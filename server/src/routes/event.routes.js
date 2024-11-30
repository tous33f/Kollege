
import { Router } from "express";
import { user_role } from "../middlewares/user_role.middleware.js";
import { createEvent, deleteEvent, getAllEvents, getEvent } from "../controllers/event.controller.js";

let router=Router()

//post
router.route("/create").post(user_role,createEvent)
router.route("/delete").post(user_role,deleteEvent)

//get
router.route("/:comm_name").get(getAllEvents)
router.route("/:comm_name/:event_id").get(getEvent)

export default router
