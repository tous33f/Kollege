
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyAuth=asyncHandler(async (req,res,next)=>{
    const access=req.cookies?.accessToken || req.header("Authorizaion")?.replace("Bearer ","")
    if(!access){
        throw new Error("Access token does not exist so cannot login")
    }
    let decodedToken
    try{
    decodedToken=jwt.verify(access,process.env.ACCESS_TOKEN_SECRET)
    }
    catch(err){
        throw new ApiError(401,`Error while verifying access token: ${err.message}`)
    }
    req.user=decodedToken
    next()
})

export {verifyAuth}
