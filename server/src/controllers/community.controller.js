import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"

//post
const createCommunity=asyncHandler( async(req,res)=>{
    let rows,fields;
    const {comm_name,fullname,about,description,type}=req.body;
    if(!comm_name || !fullname || !about || !description || !type || !(type=="Public" || type=="Private") ){
        throw new ApiError(401,"Please provide complete community information.")
    }
    const {username,email}=req.user;
    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[username]);

    const user_id=rows[0].user_id;

    [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name]);
    if(rows.length>0){
        throw new ApiError(401,"Community name already exists.")
    }

    try{
        await con.execute( `insert into kollege.Community(comm_name,fullname,about,description,type,owner) values(?,?,?,?,?,?);` , [comm_name,fullname,about,description,type,user_id] );
        [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name])
        const {community_id}=rows[0];
        await con.execute(`insert into kollege.User_has_Community (user_id,community_id,role) values(?,?,"Admin")`,[user_id,community_id])
    }
    catch(err){
        console.log(err.message)
        throw new ApiError(401,err.message)
    }
    [rows,fields]=await con.execute(`select comm_name,fullname,about,description,type,banner_url from kollege.Community where comm_name=?`,[comm_name]);
    
    res.status(201).json(
        new ApiResponse(201,"Community created successfully.",rows[0])
    );
} )

const joinCommunity=asyncHandler(async(req,res)=>{
    const {comm_name}=req.body
    let rows,fields;

    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]
    try{
    [rows,fields]=await con.execute(`select community_id,type from kollege.Community where comm_name=?`,[comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {type,community_id}=rows[0]

    //check if user is already member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }

    if(rows.length>0){
        throw new ApiError(401,"User is already member of given community")
    }

    //check if user has already requested for given community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.Community_Requests where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }

    if(rows.length>0){
        throw new ApiError(401,"User has already requested to join given community")
    }

    //if public then simply let user join
    if(type=="Public"){
        try{
            [rows,fields]=await con.execute(`insert into kollege.User_has_Community(user_id,community_id,role) values(?,?,?)`,[user_id,community_id,"Member"])
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        res.status(201).json(
            new ApiResponse(201,"User has joined community successfully",{type})
        )
    }
    //if private then save the request in db
    else{
        try{
            [rows,fields]=await con.execute(`insert into kollege.Community_Requests(user_id,community_id) values(?,?)`,[user_id,community_id])
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        res.status(201).json(
            new ApiResponse(201,"User has requested to join community successfully",{type})
        )
    }

})

const cancelJoinRequest=asyncHandler(async(req,res)=>{
    const {comm_name}=req.body
    let rows,fields;

    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]
    try{
        [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {community_id}=rows[0]

    //check if user has actually requested to join or not
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.Community_Requests where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User has not requested to join the given community")
    }

    //cancel join request
    try{
        [rows,fields]=await con.execute(`delete from kollege.Community_Requests where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Request cancelled successfully",{})
    )

})

//get
const getCommuntiesProtected=asyncHandler( async(req,res)=>{
    let rows,fields;

    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]

    try{
        [rows,fields]=await con.execute(`select count(*) as count from kollege.Community c where c.community_id not in (select h.community_id from kollege.User_has_Community h where h.user_id=? ) and c.community_id not in (select ct.community_id from kollege.Community ct where ct.owner=?);`,[user_id,user_id]);
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    const {count}=rows[0]
    const pageCount = Math.ceil(count / 6);
    let page = parseInt(req.query.p);
    if (!page) { page = 1;}
    if (page > pageCount) {
        page = pageCount
    }

    [rows,fields]=await con.execute(`select c.comm_name ,c.fullname ,c.about ,c.type ,c.banner_url ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members from kollege.Community c where c.community_id not in (select h.community_id from kollege.User_has_Community h where h.user_id=? ) and c.community_id not in (select ct.community_id from kollege.Community ct where ct.owner=?);`,[user_id,user_id])

    res.status(201).json(
        new ApiResponse(201,"Communities fetched successfully",{
            "page": page,
            "pageCount": pageCount,
            "communities": rows.slice(page * 6 - 6, page * 6)
        })
    );
} )

const getCommuntiesUnProtected=asyncHandler( async(req,res)=>{
    let rows,fields;
    [rows,fields]=await con.execute(`select count(*) as count from kollege.Community;`);
    const {count}=rows[0]
    const pageCount = Math.ceil(count / 6);
    let page = parseInt(req.query.p);
    if (!page) { page = 1;}
    if (page > pageCount) {
        page = pageCount
    }
    [rows,fields]=await con.execute(`select c.comm_name ,c.fullname ,c.about ,c.type ,c.banner_url ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members from kollege.Community c `)

    res.status(201).json(
        new ApiResponse(201,"Communities fetched successfully",{
            "page": page,
            "pageCount": pageCount,
            "communities": rows.slice(page * 6 - 6, page * 6)
        })
    );
} )

const getCreatedCommunities=asyncHandler( async(req,res)=>{
    let rows,fields;

    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]
    try{
        [rows,fields]=await con.execute(`select c.comm_name ,c.fullname ,c.about ,c.type ,c.banner_url ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members from kollege.Community c where c.owner=?`,[user_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Communities fetched successfully.",rows)
    );

} )

const getJoinedCommunities=asyncHandler( async(req,res)=>{
    let rows,fields;

    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]

    try{
        [rows,fields]=await con.execute(`select c.comm_name ,c.fullname ,c.about ,c.type ,c.banner_url ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members from kollege.Community c where c.community_id in (select h.community_id from kollege.User_has_Community h where h.user_id=? ) and c.owner!=?`,[user_id,user_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Communities fetched successfully.",rows)
    );

} )

const getRequestedCommunities=asyncHandler(async(req,res)=>{
    let rows,fields;
    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]
    try{
        [rows,fields]=await con.execute(`select c.comm_name ,c.fullname ,c.about ,c.type ,c.banner_url ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members from kollege.Community c where c.community_id in (select h.community_id from kollege.Community_Requests h where h.user_id=? ) and c.owner!=?`,[user_id,user_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Communities fetched successfully.",rows)
    );
})

const getCommunityCardInfo=asyncHandler( async(req,res)=>{
    let rows,fields;
    const {comm_name}=req.params

    try{
        [rows,fields]=await con.execute(`select community_id,type from kollege.Community where comm_name=?`,[comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {community_id}=rows[0]

    try{
    [rows,fields]=await con.execute(`select c.comm_name ,c.fullname ,c.about ,c.banner_url ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members , (select count(*) from kollege.User_has_Community uhc where uhc.role="Admin" and uhc.community_id=?) as admin_count, (select count(*) from kollege.User_has_Community uhc where uhc.role="Moderator" and uhc.community_id=?) as moderator_count from kollege.Community c where comm_name=?; `,[community_id,community_id,comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community info fetched successfully.",rows[0])
    )

} )

const getCommunityAbout=asyncHandler( async(req,res)=>{
    let rows,fields;
    const {comm_name}=req.params

    try{
    [rows,fields]=await con.execute(` select c.comm_name ,c.fullname  ,c.banner_url , c.type , c.description ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members ,u.username ,u.firstname ,u.lastname ,u.avatar_url from kollege.Community c inner join kollege.User u on c.owner=u.user_id where comm_name=?; `,[comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community info fetched successfully.",rows[0])
    )

} )

// membership 0=not joined, 1=requested to join, 2=member of community
const userCommunityInfo=asyncHandler(async(req,res)=>{
    const {comm_name}=req.params
    let rows,fields;

    [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[req.user.username])
    let {user_id}=rows[0]
    try{
    [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {community_id}=rows[0]

    try{
    [rows,fields]=await con.execute(`select * from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }

    if(rows.length<1){
        try{
        [rows,fields]=await con.execute(`select * from kollege.Community_Requests where user_id=? and community_id=?`,[user_id,community_id])
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        if(rows.length<1){
            res.status(201).json(
                new ApiResponse(201,"User has not joined the given community",{membership: 0,info: {}})
            )
        }
        else{
            res.status(201).json(
                new ApiResponse(201,"User has requested to join the given community",{membership: 1,info: rows[0]})
            )
        }
    }
    else{
        res.status(201).json(
            new ApiResponse(201,"User is a member of given community",{membership: 2,info: rows[0]})
        )
    }

})

const getCommunityMembers=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name}=req.params

    try{
        [rows,fields]=await con.execute(`select community_id,type from kollege.Community where comm_name=?`,[comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    let {community_id}=rows[0]
    let admins,moderators,members;
    
    //admins
    try{
        [rows,fields]=await con.execute(`select u.username,u.firstname,u.lastname,u.avatar_url from kollege.User_has_Community uhc inner join kollege.User u on uhc.user_id=u.user_id where uhc.community_id=? and uhc.role=?`,[community_id,"Admin"])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    admins=rows

    //moderators
    try{
        [rows,fields]=await con.execute(`select u.username,u.firstname,u.lastname,u.avatar_url from kollege.User_has_Community uhc inner join kollege.User u on uhc.user_id=u.user_id where uhc.community_id=? and uhc.role=?`,[community_id,"Moderator"])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    moderators=rows

    //members
    try{
        [rows,fields]=await con.execute(`select u.username,u.firstname,u.lastname,u.avatar_url from kollege.User_has_Community uhc inner join kollege.User u on uhc.user_id=u.user_id where uhc.community_id=? and uhc.role=?`,[community_id,"Member"])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    members=rows

    res.status(201).json(
        new ApiResponse(201,"Community members fetched successfully",{admins,moderators,members})
    )
})

export {
    createCommunity,
    getCommuntiesProtected,
    getCommuntiesUnProtected,
    getCreatedCommunities,
    getJoinedCommunities,
    getRequestedCommunities,
    getCommunityCardInfo,
    getCommunityAbout,
    userCommunityInfo,
    getCommunityMembers,
    joinCommunity,
    cancelJoinRequest
}
