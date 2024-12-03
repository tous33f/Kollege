import { Router } from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { acceptJoinRequest, cancelJoinRequest, createCommunity, getCommunityAbout, getCommunityCardInfo, getCommunityMembers, getCommunityRequests, getCommunityRoles, getCommuntiesProtected, getCommuntiesUnProtected, getCreatedCommunities, getJoinedCommunities, getRequestedCommunities, joinCommunity, leaveCommunity, removeCommunityBanner, updateCommunityAbout, updateCommunityBanner, updateCommunityDescription, updateCommunityFullname, updateCommunityName, updatePrivilege, userCommunityInfo } from "../controllers/community.controller.js";
import { user_role } from "../middlewares/user_role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

//post
router.route("/create").post(verifyAuth,upload.single("banner_url"),createCommunity)
router.route("/join_community").post(verifyAuth,joinCommunity)
router.route("/leave_community").post(verifyAuth,user_role,leaveCommunity)
router.route("/cancel_join_request").post(verifyAuth,cancelJoinRequest)
router.route("/accept_join_request").post(verifyAuth,user_role,acceptJoinRequest)
router.route("/update_comm_name").post(verifyAuth,user_role,updateCommunityName)
router.route("/update_fullname").post(verifyAuth,user_role,updateCommunityFullname)
router.route("/update_about").post(verifyAuth,user_role,updateCommunityAbout)
router.route("/update_description").post(verifyAuth,user_role,updateCommunityDescription)
router.route("/update_privlige").post(verifyAuth,user_role,updatePrivilege)
router.route("/update_banner").post(verifyAuth,upload.single("banner_url"),user_role,updateCommunityBanner)
router.route("/remove_banner").post(verifyAuth,user_role,removeCommunityBanner)

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
router.route("/:comm_name/get_community_roles").get(verifyAuth,getCommunityRoles)
router.route("/:comm_name/get_community_requests").get(verifyAuth,getCommunityRequests)

export default router
