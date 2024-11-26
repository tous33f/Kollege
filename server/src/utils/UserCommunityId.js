
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"

const getUserCommunityId=async (username,comm_name)=>{
    let rows,fields;
    try{
        [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[username])
        if(rows.length<1){
            throw new Error("User does not exist")
        }
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
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
    return {user_id,community_id}
}

export {getUserCommunityId}
