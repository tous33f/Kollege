
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//get
const getReplies=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,comment_id}=req.params;
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
    //check if comment exists
    try{
        [rows,fields]=await con.execute(` select comment_id from kollege.Comment where comment_id=? `,[comment_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given comment does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //get replies
    try{
        [rows,fields]=await con.execute(` select c.reply_id,c.comment,c.commented_on,u.username,u.firstname,u.lastname,u.avatar_url,(select count(*) from kollege.Comment_Like cl where cl.comment_id=c.comment_id ) as likes,(select count(*)>0 from kollege.Comment_Like cl where cl.comment_id=c.comment_id and cl.user_id=?) as has_liked from kollege.Reply c inner join kollege.User u on c.user_id=u.user_id where c.comment_id=? order by c.commented_on desc `,[user_id,comment_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Replies fetched successfully",rows)
    )
})

//post
const reply=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,comment_id,comment}=req.body;
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
        [rows,fields]=await con.execute(` select comment_id from kollege.Comment where comment_id=? `,[comment_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given comment does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //comment on post
    try{
        [rows,fields]=await con.execute(` insert into kollege.Reply(user_id,comment_id,comment) values(?,?,?) `,[ user_id,comment_id,comment]);
        [rows,fields]=await con.execute(` select c.reply_id,c.comment,c.commented_on,u.username,u.firstname,u.lastname,u.avatar_url,(select 0) as likes from kollege.Reply c inner join kollege.User u on c.user_id=u.user_id where c.reply_id=? `,[rows.insertId])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Reply posted successfully",rows[0])
    )
})

const remove_reply=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,reply_id}=req.body;
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
    //check if user has already replied on the comment
    try{
        [rows,fields]=await con.execute(` select user_id,reply_id from kollege.Reply where reply_id=? `,[reply_id]);
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
        await con.execute(` delete from kollege.Reply where reply_id=? `,[reply_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post comment removed successfully",{})
    )
})

export {
    getReplies,
    reply,
    remove_reply
}
