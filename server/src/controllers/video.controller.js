
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//post
const createVideo=asyncHandler( async(req,res)=>{
    let rows,fields;
    const {comm_name,course_id,title,description,video_url}=req.body;
    if( !comm_name || !course_id || !title || !description || !video_url){
        throw new ApiError(401,"Please provide complete video information.")
    }
    let role
    const {username}=req.user;
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id,role from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot delete post because user is not member of given community");
        }
        role=rows[0].role
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    if(role=="Member"){
        throw new ApiError(401,"User is not privileged to perform operation")
    }

    try{
        [rows,fields]=await con.execute( `insert into kollege.Video(course_id,title,description,video_url) values(?,?,?,?);` , [course_id,title,description,video_url] );
        let {insertId}=rows;
        [rows,fields]=await con.execute(`select video_id,course_id,title,description,video_url from kollege.Video where video_id=?`,[insertId])
    }
    catch(err){
        console.log(err.message)
        throw new ApiError(401,err.message)
    }    
    res.status(201).json(
        new ApiResponse(201,"Video created successfully.",rows[0])
    );
} )

const deleteVideo=asyncHandler(async(req,res)=>{
    let rows,fields
    const {video_id,comm_name}=req.body;
    if(!video_id){
        throw new ApiError(401,"Video Id is not given");
    }
    let role
    const {username}=req.user;
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id,role from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot delete post because user is not member of given community");
        }
        role=rows[0].role
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    if(role=="Member"){
        throw new ApiError(401,"User is not privileged to perform operation")
    }
    //get course from db
    try{
        [rows,fields]=await con.execute(`select video_id from kollege.Video where video_id=?`,[video_id])
        if(rows.length<1){
            throw new ApiError(401,"Requested video does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //delete course from db
    try{
        [rows,fields]=await con.execute(`delete from kollege.Video where video_id=?`,[video_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Video deleted successfully",rows[0])
    )
})

//get
const getVideo=asyncHandler(async(req,res)=>{
    let rows,fields
    const {course_id,video_id,comm_name}=req.params;
    const {username}=req.user;
    if(!course_id || !video_id || !comm_name){
        throw new ApiError(401,"Course Id or community name or video id is not given");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot get course because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //get course from db
    try{
        [rows,fields]=await con.execute(`select course_id,name,about,banner_url from kollege.Course where course_id=?`,[course_id])
        if(rows.length<1){
            throw new ApiError(401,"Requested course does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    try{
        [rows,fields]=await con.execute(`select video_id,course_id,title,description,video_url from kollege.Video where video_id=?`,[video_id])
        if(rows.length<1){
            throw new ApiError(401,"Given video does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Video fetched successfully",rows[0])
    )
})

const getAllVideos=asyncHandler(async(req,res)=>{
    let rows,fields
    const {comm_name,course_id}=req.params;
    const {username}=req.user;
    if(!comm_name || !course_id){
        throw new ApiError(401,"Community name or course id is not given");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot get courses because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //get course from db
    try{
        [rows,fields]=await con.execute(`select course_id,name,about,banner_url from kollege.Course where course_id=?`,[course_id])
        if(rows.length<1){
            throw new ApiError(401,"Requested course does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //get videos from db
    try{
        [rows,fields]=await con.execute(`select video_id,course_id,title,description,video_url from kollege.Video where course_id=?`,[course_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Videos fetched successfully",rows)
    )
})

export {
    createVideo,
    deleteVideo,
    getAllVideos,
    getVideo
}
