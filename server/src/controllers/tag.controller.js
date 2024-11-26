
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//get
const getTags=asyncHandler(async(req,res)=>{
    let rows,fields;
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
            throw new ApiError(401,"Cannot get tags because user is not member of given community");
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    try{
        [rows,fields]=await con.execute(` select t.tag_id,t.tag_name from kollege.Community_has_Tag cht inner join kollege.Tag t on cht.tag_id=t.tag_id where community_id=? `,[community_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Community tags fetched successfully",rows)
    )
})

//post
const createTags=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,tags}=req.body;
    if(!comm_name || !tags){
        throw new ApiError(401,"Community name or tags are not given")
    }
    const {username,role}=req.user;
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    if(role=="Member"){
        throw new ApiError(401,"User is not authorized to create tags");
    }
    let query;
    if(!Array.isArray(tags)){
        throw new ApiError("Tags are not given")
    }
    let returnIds=[];
    try{
        for(let i=0;i<tags.length;i++){
            [rows,fields]=await con.execute(`insert into Tag(tag_name) values(?)`,[tags[i]]);
            returnIds.push(rows?.insertId)
        }
        for(let i=0;i<tags.length;i++){
            [rows,fields]=await con.execute(`insert into Community_has_Tag(tag_id,community_id) values(?,?)`,[returnIds[i],community_id]);
        }
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Tags added to community successfully",{})
    )
})

const deleteTag=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,tag_id}=req.body;
    if(!comm_name || !tag_id){
        throw new ApiError(401,"Community name or tag id are not given")
    }
    const {username,role}=req.user;
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    if(role=="Member"){
        throw new ApiError(401,"User is not authorized to remove tags");
    }
    //check if tag exists
    try{
        [rows,fields]=await con.execute(` select tag_id from kollege.Tag where tag_id=? `,[tag_id])
        if(rows.length<1){
            throw new ApiError(401,"Given tag does not exist")
        }
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    //delete tag
    try{
        [rows,fields]=await con.execute(` delete from kollege.Tag where tag_id=? `,[tag_id])
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Tags deleted from community successfully",{})
    )
})

export {
    createTags,
    deleteTag,
    getTags
}
