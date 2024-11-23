
import {asyncHandler} from "../utils/AsyncHandler.js"
import { con } from "../index.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { generateAccessToken,generateRefreshToken } from "../utils/TokenGeneration.js"

const registerUser=asyncHandler( async(req,res)=>{

    let rows,fields

    //check if all fields are given
    const {username,firstname,lastname,email,password}=req.body
    if( username?.trim()==="" || firstname?.trim()==="" || lastname?.trim()==="" || email?.trim()==="" || password?.trim()==="" ){
        throw new ApiError(401,"All fields are required")
    }

    //check if user already exists
    [rows,fields]=await con.execute(`select * from kollege.User where username=? or email=?`,[username,email])
    if(rows.length>0){
        let err_messsage;
        if(rows[0].username==username && rows[0].email==email){
            err_messsage="User already exists";
        }
        else if(rows[0].username==username){
            err_messsage="Username already taken"
        }
        else{
            err_messsage="Email already used"
        }
        throw new ApiError(402,err_messsage)
    }

    //check for avatar and coverImage
    // let avatar=req.files?.avatar
    // let coverImage=req.files?.coverImage
    // if(!avatar){
    //     throw new ApiError(403,"Avatar is required")
    // }
    // avatar=await fileUploader(avatar[0].path)
    // if(coverImage && Array.isArray(coverImage) && coverImage.length>0){
    //     coverImage=await fileUploader(coverImage[0].path)
    // }

    //create user
    await con.execute(`insert into User(username,firstname,lastname,email,password) values(?,?,?,?,?);`,[username,firstname,lastname,email,password]);

    //validate if its created and remove password and refreshToken from response
    [rows,fields]=await con.execute(`select username,firstname,lastname,email from kollege.User where username=?`,[username]);
    if(rows.length<1){
        throw new ApiError(405,"Error creating user in database")
    }

    //return response to user
    res.status(201).json(
        new ApiResponse(201,"User created successfully",rows[0])
    )
} )

const loginUser=asyncHandler( async(req,res)=>{
    let rows,fields
    // check for password,username or email
    const {email,password}=req.body
    if( !email || !password ){
        throw new ApiError(401,"Email or password is required")
    }

    // find user if exists
    [rows,fields]=await con.execute(`select user_id,username,email,password from kollege.User where email=?`,[email])
    if(rows.length<1){
        throw new ApiError(402,"User does not exist")
    }
    // check if password is correct or not
    if( rows[0].password!=password ){
        throw new ApiError(403,"Passwword is incorrect")
    }

    // generate access and refresh tokens
    let access,refresh
    try{
        access=generateAccessToken(rows[0].username,email)
        refresh=generateRefreshToken(rows[0].user_id)
    }
    catch(err){
        throw new ApiError(401,`Error while creating access and refresh token: ${err.message} `)
    }

    // save refreshToken in database and return the updated reponse to user
    await con.execute(`update kollege.User set refresh_token=? where user_id=?`,[refresh,rows[0].user_id]);
    res.status(201)
    .cookie("accessToken",access,{httpOnly: true,secure: false, maxAge: 1000*60*60*24 })
    .cookie("refreshToken",refresh,{httpOnly: true,secure: false , maxAge: 1000*60*60*24*10 })
    .json(
        new ApiResponse(201,"User logged in successfully",{username: rows[0].username,email: rows[0].email ,refreshToken: refresh,accessToken: access} )
    )
} )

const logoutUser=asyncHandler(async(req,res)=>{
    // get user object from request
    const user=req.user
    // update refresh token in database
    try{
        await con.execute(`update kollege.User set refresh_token=? where username=?`,["",user.username])
    }
    catch(err){
        throw new ApiError(401,`Error while removing refresh token: ${err.message}`)
    }
    // clear acces and refresh token cookies
    res.status(201).clearCookie("accessToken").clearCookie("refreshToken").json(
        new ApiResponse(201,"User logged out successfully",{})
    )
} )

const getAccessTokenFromRefreshToken=asyncHandler(async(req,res)=>{
    let rows,fields;
    const refresh=req.cookies?.refreshToken || req.body.refreshToken
    if(!refresh){
        throw new ApiError(401,"Refresh token not found for generating new access token")
    }
    let decodedToken
    try{
        decodedToken=await jwt.verify(refresh,process.env.REFRESH_TOKEN_SECRET)
    }
    catch(err){
        throw new ApiError(401,"Error verifying refresh token")
    }
    [rows,fields]=await con.execute(`select username,email from kollege.User where user_id=?`,[decodedToken.user_id])
    if(rows.length<1){
        throw new ApiError(401,"User with refresh token not found")
    }
    const access=generateAccessToken(rows[0].username,rows[0].email)
    res.status(201)
    .cookie("accessToken",access,{httpOnly: true,secure: false ,maxAge: 1000*60*60*24(Number(process.env.ACCESS_TOKEN_EXPIRY.replace("d",""))) })
    .json(
        new ApiResponse(201,"Access token created successfully",{accessToken: access})
    )
})

const getUser=asyncHandler( async(req,res)=>{
    let rows,fields;
    // get user object from request
    const user=req.user
    //query db
    try{
        [rows,fields]=await con.execute(`select username,firstname,lastname,email,avatar_url from kollege.User where username=?`,[user.username])
    }
    catch(err){
        throw new ApiError(401,`Error while fetching user: ${err.message}`)
    }
    res.status(201).json(
        new ApiResponse(201,"User fetched successfully",rows[0])
    )
} )

export {registerUser,loginUser,logoutUser,getAccessTokenFromRefreshToken,getUser}
