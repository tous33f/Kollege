
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//get
const getLikes=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,post_id}=req.params;
    const {username}=req.user;
    let {user_id,community_id}=await getUserCommunityId(username,comm_name)
    //check if user is member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy so cannot get likes")
    }
    //check if post exists
    try{
        [rows,fields]=await con.execute(` select post_id from kollege.Post where post_id=? `,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if user has liked the post
    try{
        [rows,fields]=await con.execute(` select user_id,post_id from kollege.Post_Like where user_id=? and post_id=? `,[user_id,post_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    let flag=false;
    if(rows.length>0){
        flag=true;
    }
    //get likes
    try{
        [rows,fields]=await con.execute(` select count(*) as likes from kollege.Post_Like where post_id=? `,[post_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Likes fetched successfully",{likes:rows[0].likes,user_has_liked:flag})
    )
})

//post
const like=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,post_id}=req.body;
    const {username}=req.user;
    let {user_id,community_id}=await getUserCommunityId(username,comm_name)
    //check if user is member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy so cannot like")
    }
    //check if post exists
    try{
        [rows,fields]=await con.execute(` select post_id from kollege.Post where post_id=? `,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if user has already liked the post
    try{
        [rows,fields]=await con.execute(` select user_id,post_id from kollege.Post_Like where user_id=? and post_id=? `,[user_id,post_id]);
        if(rows.length>0){
            throw new ApiError(401,"User has already liked the post");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //like post
    try{
        await con.execute(` insert into kollege.Post_Like(user_id,post_id) values(?,?) `,[ user_id,post_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post liked successfully",{})
    )
})

const remove_like=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,post_id}=req.body;
    const {username}=req.user;
    let {user_id,community_id}=await getUserCommunityId(username,comm_name)
    //check if user is member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy so cannot like")
    }
    //check if post exists
    try{
        [rows,fields]=await con.execute(` select post_id from kollege.Post where post_id=? `,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if user has already liked the post
    try{
        [rows,fields]=await con.execute(` select user_id,post_id from kollege.Post_Like where user_id=? and post_id=? `,[user_id,post_id]);
        if(rows.length<1){
            throw new ApiError(401,"User has not liked the post yet");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //remove post like
    try{
        await con.execute(` delete from kollege.Post_Like where user_id=? and post_id=? `,[ user_id,post_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post like removed successfully",{})
    )
})

const comment_like=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,comment_id}=req.body;
    const {username}=req.user;
    let {user_id,community_id}=await getUserCommunityId(username,comm_name)
    //check if user is member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy so cannot like")
    }
    //check if comment exists
    try{
        [rows,fields]=await con.execute(` select post_id from kollege.Comment where comment_id=? `,[comment_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given comment does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if user has already liked the comment
    try{
        [rows,fields]=await con.execute(` select user_id,comment_id from kollege.Comment_Like where user_id=? and comment_id=? `,[user_id,comment_id]);
        if(rows.length>0){
            throw new ApiError(401,"User has already liked the comment");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //like post
    try{
        await con.execute(` insert into kollege.Comment_Like(user_id,comment_id) values(?,?) `,[ user_id,comment_id ]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Comment liked successfully",{})
    )
})

const remove_comment_like=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,comment_id}=req.body;
    const {username}=req.user;
    let {user_id,community_id}=await getUserCommunityId(username,comm_name)
    //check if user is member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy so cannot like")
    }
    //check if post exists
    try{
        [rows,fields]=await con.execute(` select comment_id from kollege.Comment where comment_id=? `,[comment_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given comment does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if user has liked the comment
    try{
        [rows,fields]=await con.execute(` select user_id,comment_id from kollege.Comment_Like where user_id=? and comment_id=? `,[user_id,comment_id]);
        if(rows.length<1){
            throw new ApiError(401,"User has not liked the post yet");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //remove post like
    try{
        await con.execute(` delete from kollege.Comment_Like where user_id=? and comment_id=? `,[ user_id,comment_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Comment like removed successfully",{})
    )
})

export {
    like,
    getLikes,
    remove_like,
    comment_like,
    remove_comment_like
}
