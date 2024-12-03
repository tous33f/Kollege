import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//post
const createCourse=asyncHandler( async(req,res)=>{
    let rows,fields;
    const {comm_name,name,about}=req.body;
    if( !name || !about || !comm_name){
        throw new ApiError(401,"Please provide complete community information.")
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

    let banner_url=req?.file?.filename
    try{
        if(banner_url){
            [rows,fields]=await con.execute( `insert into kollege.Course(community_id,name,about,banner_url) values(?,?,?,?);` , [community_id,name,about,banner_url] );
            let {insertId}=rows;
            [rows,fields]=await con.execute(`select course_id,name,about,banner_url from kollege.Course where course_id=?`,[insertId])
        }
        else{
            [rows,fields]=await con.execute( `insert into kollege.Course(community_id,name,about) values(?,?,?);` , [community_id,name,about] );
            let {insertId}=rows;
            [rows,fields]=await con.execute(`select course_id,name,about,banner_url from kollege.Course where course_id=?`,[insertId])
        }
    }
    catch(err){
        console.log(err.message)
        throw new ApiError(401,err.message)
    }    
    res.status(201).json(
        new ApiResponse(201,"Course created successfully.",rows[0])
    );
} )

const deleteCourse=asyncHandler(async(req,res)=>{
    let rows,fields
    const {course_id,comm_name}=req.body;
    if(!course_id){
        throw new ApiError(401,"Course Id is not given");
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
        [rows,fields]=await con.execute(`select course_id,name,about,banner_url from kollege.Course where course_id=?`,[course_id])
        if(rows.length<1){
            throw new ApiError(401,"Requested course does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //delete course from db
    try{
        [rows,fields]=await con.execute(`delete from kollege.Course where course_id=?`,[course_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Course deleted successfully",rows[0])
    )
})

//get
const getCourse=asyncHandler(async(req,res)=>{
    let rows,fields
    const {course_id,comm_name}=req.params;
    const {username}=req.user;
    if(!course_id){
        throw new ApiError(401,"Course Id is not given");
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
    res.status(201).json(
        new ApiResponse(201,"Course fetched successfully",rows[0])
    )
})

const getAllCourses=asyncHandler(async(req,res)=>{
    let rows,fields
    const {comm_name}=req.params;
    const {username}=req.user;
    if(!comm_name){
        throw new ApiError(401,"Community name is not given");
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
    //get post from db
    try{
        [rows,fields]=await con.execute(`select course_id,name,about,banner_url from kollege.Course where community_id=?`,[community_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Posts fetched successfully",rows)
    )
})

export {
    createCourse,
    deleteCourse,
    getCourse,
    getAllCourses
}
