import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { cancelJoinRequest, createCommunity, getCommunityAbout, getCommunityCardInfo, getCommunityMembers, getCommuntiesProtected, getCommuntiesUnProtected, getCreatedCommunities, getJoinedCommunities, getRequestedCommunities, joinCommunity, userCommunityInfo } from "../controllers/community.controller.js";

const router=Router()

//post
router.route("/create").post(verifyAuth,createCommunity)
router.route("/join_community").post(verifyAuth,joinCommunity)
router.route("/cancel_join_request").post(verifyAuth,cancelJoinRequest)

//get
router.route("/get_communities_protected").get(verifyAuth,getCommuntiesProtected)
router.route("/get_communities_unprotected").get(getCommuntiesUnProtected)
router.route("/get_created_communities").get(verifyAuth,getCreatedCommunities)
router.route("/get_requested_communities").get(verifyAuth,getRequestedCommunities)
router.route("/get_joined_communities").get(verifyAuth,getJoinedCommunities)
router.route("/:comm_name/get_community_about").get(getCommunityAbout)
router.route("/:comm_name/get_community_card_info").get(getCommunityCardInfo)
router.route("/:comm_name/user_community_info").get(verifyAuth,userCommunityInfo)
router.route("/:comm_name/get_community_members").get(verifyAuth,getCommunityMembers)

export default router
