
import { asyncHandler } from "../utils/AsyncHandler.js";
import { con } from "../index.js";
import { ApiError } from "../utils/ApiError.js";

export const user_role=asyncHandler(async (req,res,next)=>{
    let rows,fields;
    const {comm_name}=req.body ;
    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]
    try{
        [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name])
        if(rows.length<1){
            throw new Error("Community does not exist")
        }
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {community_id}=rows[0]
    //getting user role
    try{
        [rows,fields]=await con.execute(`select role from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
        if(rows.length<1){
            throw new Error("User is not member of given community")
        }
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {role}=rows[0]
    //adding role to user object
    req.user.role=role;
    //checking if user is owner of community or not
    try{
        [rows,fields]=await con.execute(`select owner from kollege.Community where community_id=?`,[community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(user_id==rows[0].owner){
        req.user.role="Owner";
    }
    next()
})

