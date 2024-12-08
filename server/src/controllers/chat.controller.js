
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"

//post
const sendMessage=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {recv,message}=req.body;
    const {username}=req.user;
    try{
        [rows,fields]=await con.execute(` select user_id from kollege.User where username=? `,[username])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    let send=rows[0].user_id;
    try{
        await con.beginTransaction();
        [rows,fields]=await con.execute(` select user_A,user_B from kollege.User_has_Messaged where (user_A=? and user_B=?) or (user_A=? and user_B=?) `,[send,recv,recv,send])
        let user;
        if(rows.length<1){
            await con.execute(` insert into kollege.User_has_Messaged values(?,?) `,[send,recv]);
        }
        [rows,fields]=await con.execute(` insert into kollege.Message(send,recv,message) values(?,?,?) `,[send,recv,message])
        let message_id=rows.insertId;
        [rows,fields]=await con.execute(` select message_id,send,recv,message,timestamp from kollege.Message where message_id=? `,[message_id]);
        await con.commit();
    }
    catch(err){
        await con.rollback();
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Comments fetched successfully",rows[0])
    )
})

//get
const getMessagedUsers=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {username}=req.user;
    try{
        [rows,fields]=await con.execute(` select user_id from kollege.User where username=? `,[username])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    let {user_id}=rows[0];
    try{
        [rows,fields]=await con.execute(` select u1.user_id as u1_user_id,u1.username as u1_username,u1.firstname as u1_firstname,u1.lastname as u1_lastname,u1.avatar_url as u1_avatar_url,u2.user_id as u2_user_id,u2.username as u2_username,u2.firstname as u2_firstname,u2.lastname as u2_lastname,u2.avatar_url as u2_avatar_url from kollege.User_has_Messaged uhm inner join kollege.User u1 on uhm.user_A=u1.user_id inner join kollege.User u2 on uhm.User_B=u2.user_id where user_A=? or user_B=? `,[user_id,user_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Users fetched successfully",rows)
    )
})

const getMessages=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {user_id}=req.params
    const {username}=req.user;
    try{
        [rows,fields]=await con.execute(` select user_id from kollege.User where username=? `,[username])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    let user_id_own=rows[0]?.user_id;
    try{
        [rows,fields]=await con.execute(` select message_id,send,recv,message,timestamp from kollege.Message where (send=? and recv=?) or (send=? and recv=?) order by timestamp  `,[user_id,user_id_own,user_id_own,user_id])
    }
    catch(err){
        throw new ApiError(401,err.message);
    }
    res.status(201).json(
        new ApiResponse(201,"Messages fetched successfully",rows)
    )
})

export {sendMessage,getMessagedUsers,getMessages}
