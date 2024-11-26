
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//get
const getComments=asyncHandler(async(req,res)=>{
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
    //get comments
    try{
        [rows,fields]=await con.execute(` select c.comment_id,c.comment,c.commented_on,u.username,u.firstname,u.lastname,u.avatar_url,(select count(*) from kollege.Comment_Like cl where cl.comment_id=c.comment_id ) as likes,(select count(*)>0 from kollege.Comment_Like cl where cl.comment_id=c.comment_id and cl.user_id=?) as has_liked from kollege.Comment c inner join kollege.User u on c.user_id=u.user_id where c.post_id=? order by c.commented_on desc `,[user_id,post_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Comments fetched successfully",rows)
    )
})

//post
const comment=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,post_id,comment}=req.body;
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
    //comment on post
    try{
        [rows,fields]=await con.execute(` insert into kollege.Comment(user_id,post_id,comment) values(?,?,?) `,[ user_id,post_id,comment]);
        [rows,fields]=await con.execute(` select c.comment_id,c.comment,c.commented_on,u.username,u.firstname,u.lastname,u.avatar_url from kollege.Comment c inner join kollege.User u on c.user_id=u.user_id where c.comment_id=? `,[rows.insertId])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Comment posted successfully",rows[0])
    )
})

const remove_comment=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,post_id,comment_id}=req.body;
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
    //check if user has already commented on the post
    try{
        [rows,fields]=await con.execute(` select user_id,comment_id from kollege.Comment where comment_id=? `,[comment_id]);
        if(rows.length<1){
            throw new ApiError(401,"User has not commented the given comment");
        }
        if(user_id!=rows[0].user_id){
            throw new ApiError(401,"User is not authorized to delete the comment");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //remove post comment
    try{
        await con.execute(` delete from kollege.Comment where comment_id=? `,[ comment_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post comment removed successfully",{})
    )
})

export {
    getComments,
    comment,
    remove_comment
}
