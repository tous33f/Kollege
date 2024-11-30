import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

//get
const getAllEvents=asyncHandler(async(req,res)=>{
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
        [rows,fields]=await con.execute(` select event_id,title,description,start,end,type from kollege.Event where community_id=? order by start asc `,[community_id]);
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Community events fetched successfully",rows)
    )
})

const getEvent=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,event_id}=req.params;
    const {username}=req.user;
    if(!comm_name || event_id){
        throw new ApiError(401,"Community name or event id is not given");
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
        [rows,fields]=await con.execute(` select event_id,title,description,start,end,type from kollege.Event where event_id=? `,[event_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given event does not exist")
        }
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Community event fetched successfully",rows[0])
    )
})

//post
const createEvent=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,title,description,start,end,type}=req.body;
    if(!comm_name || !title || !description || !start || !end || !type || !(type=="Online" || type=="Onsite")){
        throw new ApiError(401,"Information given is incorrect")
    }
    const {username,role}=req.user;
    const {user_id,community_id}=await getUserCommunityId(username,comm_name);
    if(role=="Member"){
        throw new ApiError(401,"User is not authorized to create event");
    }
    try{
        [rows,fields]=await con.execute(`insert into kollege.Event(title,description,start,end,type,community_id) values(?,?,?,?,?,?)`,[title,description,start,end,type,community_id]);
        [rows,fields]=await con.execute(` select event_id,title,description,start,end,type from kollege.Event where event_id=? `,[rows?.insertId]);
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Event added to community successfully",rows[0])
    )
})

const deleteEvent=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name,event_id}=req.body;
    if(!comm_name || !event_id){
        throw new ApiError(401,"Community name or event id is not given")
    }
    const {username,role}=req.user;
    if(role=="Member"){
        throw new ApiError(401,"User is not authorized to create event");
    }
    //check if event exists
    try{
        [rows,fields]=await con.execute(` select event_id from kollege.Event where event_id=? `,[event_id]);
        if(rows.length<1){
            throw new ApiError(401,"Given event dies not exist")
        }
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    // delete event 
    try{
        [rows,fields]=await con.execute(` delete from kollege.Event where event_id=? `,[event_id]);
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Event deleted from community successfully",rows[0])
    )
})

export {
    getAllEvents,
    getEvent,
    createEvent,
    deleteEvent
}
