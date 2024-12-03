
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//get
const getPost=asyncHandler(async(req,res)=>{
    let rows,fields
    const {post_id,comm_name}=req.params;
    const {username}=req.user;
    if(!post_id){
        throw new ApiError(401,"Post Id is not given");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot get post because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //get post from db
    try{
        [rows,fields]=await con.execute(` select p.post_id,p.title,p.content,p.graphics_url,p.created_on,t.tag_name,u.username,u.firstname,u.lastname,u.avatar_url from kollege.Post p inner join kollege.Tag t on p.tag_id=t.tag_id inner join kollege.User u on p.user_id=u.user_id where p.post_id=? `,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Requested post does not exist");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post fetched successfully",rows[0])
    )
})

//get
const getAllPosts=asyncHandler(async(req,res)=>{
    let rows,fields
    const {comm_name}=req.params;
    let {tag_name}=req.query
    const {username}=req.user;
    if(!comm_name){
        throw new ApiError(401,"Community name is not given");
    }
    if(tag_name=="All"){
        tag_name=null;
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot get post because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //get post from db
    try{
        if(tag_name){
            [rows,fields]=await con.execute(` select p.post_id,p.title,p.content,p.graphics_url,p.created_on,t.tag_name,u.username,u.firstname,u.lastname,u.avatar_url,(select count(*) from kollege.Post_Like pk where pk.post_id=p.post_id) as likes,(select count(*) from kollege.Comment c where c.post_id=p.post_id) as comments from kollege.Post p inner join kollege.Tag t on p.tag_id=t.tag_id inner join kollege.User u on p.user_id=u.user_id where p.community_id=? and t.tag_name=? order by p.created_on desc`,[community_id,tag_name]);
        }
        else{
            [rows,fields]=await con.execute(` select p.post_id,p.title,p.content,p.graphics_url,p.created_on,t.tag_name,u.username,u.firstname,u.lastname,u.avatar_url,(select count(*) from kollege.Post_Like pk where pk.post_id=p.post_id) as likes,(select count(*) from kollege.Comment c where c.post_id=p.post_id) as comments from kollege.Post p inner join kollege.Tag t on p.tag_id=t.tag_id inner join kollege.User u on p.user_id=u.user_id where p.community_id=? order by p.created_on desc`,[community_id]);
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Posts fetched successfully",rows)
    )
})

//post
const createPost=asyncHandler(async(req,res)=>{
    let rows,fields
    const {comm_name,tag_id,title,content}=req.body;
    const {username}=req.user;
    if(!comm_name || !tag_id || !title || !content){
        throw new ApiError(401,"Post information is incomplete");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot post because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if tag id is part of community
    if(tag_id!=0){
    try{
        [rows,fields]=await con.execute(` select tag_id,tag_name from kollege.Tag where tag_id=? `,[tag_id]);
        if(rows.length<1){
            throw new ApiError(401,"Post tag is invalid");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    }
    //get post image
    let graphics_url=req?.file?.filename
    //create post
    try{
        if(graphics_url){
            [rows,fields]=await con.execute(` insert into kollege.Post(user_id,community_id,tag_id,title,content,graphics_url) values(?,?,?,?,?,?) `,[user_id,community_id,tag_id,title,content,graphics_url]);
            [rows,fields]=await con.execute(` select * from kollege.Post where post_id=? `,[rows.insertId])
        }
        else{
            [rows,fields]=await con.execute(` insert into kollege.Post(user_id,community_id,tag_id,title,content) values(?,?,?,?,?) `,[user_id,community_id,tag_id,title,content]);
            [rows,fields]=await con.execute(` select * from kollege.Post where post_id=? `,[rows.insertId])
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post created successfully",rows[0])
    )

})

const deletePost=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,post_id}=req.body;
    if(!comm_name || !post_id){
        throw new ApiError(401,"Complete information to delete post is not given");
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
    //check if post exists and user is allowed to update post
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.Post where post_id=?`,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
        if((user_id!=rows[0].user_id && role=="Member") || community_id!=rows[0].community_id){
            throw new ApiError(401,"User is not authorized to delete given post");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //delete post
    try{
        await con.execute(` delete from kollege.Post where post_id=? `,[post_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post deleted successfully")
    )
})

const updateTitle=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {username}=req.user
    const {updated_title,comm_name,post_id}=req.body;
    if(!updated_title || !comm_name || !post_id){
        throw new ApiError(401,"Complete information to update is not given");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot post because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if post exists and user is allowed to update post
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.Post where post_id=?`,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
        if(user_id!=rows[0].user_id || community_id!=rows[0].community_id){
            throw new ApiError(401,"User is not authorized to update given post");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //update post
    try{
        [rows,fields]=await con.execute(` update kollege.Post set title=? where post_id=? `,[updated_title,post_id]);
        [rows,fields]=await con.execute(` select * from kollege.Post where post_id=? `,[post_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post updated successfully",rows)
    )
})

const updateContent=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {username}=req.user
    const {updated_content,comm_name,post_id}=req.body;
    if(!updated_content|| !comm_name || !post_id){
        throw new ApiError(401,"Complete information to update is not given");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot post because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if post exists and user is allowed to update post
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.Post where post_id=?`,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
        if(user_id!=rows[0].user_id || community_id!=rows[0].community_id){
            throw new ApiError(401,"User is not authorized to update given post");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //update post
    try{
        [rows,fields]=await con.execute(` update kollege.Post set content=? where post_id=? `,[updated_content,post_id]);
        [rows,fields]=await con.execute(` select * from kollege.Post where post_id=? `,[post_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post updated successfully",rows)
    )
})

const updateTag=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {username}=req.user
    const {updated_tag_id,comm_name,post_id}=req.body;
    if(!updated_tag_id|| !comm_name || !post_id){
        throw new ApiError(401,"Complete information to update is not given");
    }
    //check if user is member of community
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=? `,[user_id,community_id]);
        if(rows.length<1){
            throw new ApiError(401,"Cannot post because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if post exists and user is allowed to update post
    try{
        [rows,fields]=await con.execute(` select user_id,community_id from kollege.Post where post_id=?`,[post_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given post does not exist");
        }
        if(user_id!=rows[0].user_id || community_id!=rows[0].community_id){
            throw new ApiError(401,"User is not authorized to update given post");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //check if updated tag is part of community
    try{
        [rows,fields]=await con.execute(` select tag_id,tag_name from kollege.Tag where tag_id=? `,[updated_tag_id]);
        if(rows.length<1){
            throw new ApiError(401,"Updated post tag is invalid");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    //update post
    try{
        [rows,fields]=await con.execute(` update kollege.Post set tag_id=? where post_id=? `,[updated_tag_id,post_id]);
        [rows,fields]=await con.execute(` select * from kollege.Post where post_id=? `,[post_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Post updated successfully",rows)
    )
})

export {
    createPost,
    updateTitle,
    updateContent,
    updateTag,
    deletePost,
    getPost,
    getAllPosts
}
