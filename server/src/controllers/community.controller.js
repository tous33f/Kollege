import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { con } from "../index.js"
import { getUserCommunityId } from "../utils/UserCommunityId.js"

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

    let banner_url=req?.file?.filename

    try{
        if(banner_url){
            await con.execute( `insert into kollege.Community(comm_name,fullname,about,description,type,owner,banner_url) values(?,?,?,?,?,?,?);` , [comm_name,fullname,about,description,type,user_id,banner_url] );
            [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name])
        }
        else{
            await con.execute( `insert into kollege.Community(comm_name,fullname,about,description,type,owner) values(?,?,?,?,?,?);` , [comm_name,fullname,about,description,type,user_id] );
            [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[comm_name])
        }
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

const leaveCommunity=asyncHandler(async (req,res)=>{
    let rows,fields;
    const {comm_name,removed_username}=req.body
    const {username,role}=req.user
    let user_id,community_id
    if(role=="Owner" && !removed_username){
        throw new ApiError(401,"User is the owner of community so cannot leave")
    }
    if(removed_username && role!="Member"){
        let output=await getUserCommunityId(removed_username,comm_name)
        user_id=output.user_id
        community_id=output.community_id
    }
    else{
        let output=await getUserCommunityId(username,comm_name)
        user_id=output.user_id
        community_id=output.community_id
    }
    //check if user is member of community
    try{
        [rows,fields]=await con.execute(`select user_id,community_id from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy so cannot leave")
    }
    //remove from User_has_Community
    try{
        await con.execute(`delete from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"User has successfully left the community")
    )
} )

const cancelJoinRequest=asyncHandler(async(req,res)=>{
    const {comm_name,updated_username}=req.body
    let rows,fields;
    if(updated_username){
        const {username}=req.user
        const {user_id,community_id}=await getUserCommunityId(username,comm_name)
        //getting user role
        try{
            [rows,fields]=await con.execute(`select role from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
            if(rows.length<1){
                throw new Error("User cancelling join request is not member of given community")
            }
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        let {role}=rows[0]
        if(role=="Member"){
        throw new ApiError(401,"User does not has privilege to cancel join requests")
        }
        //checking if updated_user has requested to join the community or not
        try{
            [rows,fields]=await con.execute(`select user_id from kollege.User where username=?`,[updated_username])
            if(rows.length<1){
                throw new Error("User whose request is to be cancelled does not exist")
            }
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        let updated_user_id=rows[0].user_id
        try{
            [rows,fields]=await con.execute(`select user_id,community_id from kollege.Community_Requests where user_id=? and community_id=?`,[updated_user_id,community_id])
            if(rows.length<1){
                throw new Error("User has not requested to join the community")
            }
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        //cancel request
        try{
            await con.execute(`delete from kollege.Community_Requests where user_id=? and community_id=?`,[updated_user_id,community_id])
        }
        catch(err){
            throw new ApiError(401,err.message)
        }
        res.status(201).json(
            new ApiResponse(201,"Request cancelled successfully")
        )
    }

    else{
        const {username}=req.user
        const {user_id,community_id}=await getUserCommunityId(username,comm_name)

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
    }

})

const acceptJoinRequest=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {updated_username,comm_name}=req.body
    let {role}=req.user
    let {user_id,community_id}=await getUserCommunityId(updated_username,comm_name)
    if(role=="Member"){
        throw new ApiError(401,"User does has privilege to accept join requests")
    }
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
    //accept user join request
    try{
        await con.execute(`delete from kollege.Community_Requests where user_id=? and community_id=?`,[user_id,community_id])
        await con.execute(`insert into kollege.User_has_Community(user_id,community_id) values(?,?)`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Request accepted successfully")
    )
})

const updateCommunityName=asyncHandler(async (req,res)=>{
    let rows,fields;
    const {comm_name,new_comm_name}=req.body
    const {username,role}=req.user
    const {user_id,community_id}=await getUserCommunityId(username,comm_name)
    if(role=="Member"){
        throw new ApiError(401,"User is not privileged to perform operation")
    }
    //check if new username already exists
    try{
        [rows,fields]=await con.execute(`select community_id from kollege.Community where comm_name=?`,[new_comm_name])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length>0){
        throw new ApiError(401,"Community name already exists")
    }
    //update comm_name
    try{
        await con.execute(`update kollege.Community set comm_name=? where community_id=?`,[new_comm_name,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community name updated successfully",{})
    )
} )

const updateCommunityFullname=asyncHandler(async (req,res)=>{
    const {comm_name,new_fullname}=req.body
    const {username,role}=req.user
    const {user_id,community_id}=await getUserCommunityId(username,comm_name)
    if(role=="Member"){
        throw new ApiError(401,"User is not privileged to perform operation")
    }
    //update fullname
    try{
        await con.execute(`update kollege.Community set fullname=? where community_id=?`,[new_fullname,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community fullname updated successfully",{})
    )
} )

const updateCommunityAbout=asyncHandler(async (req,res)=>{
    const {comm_name,new_about}=req.body
    const {username,role}=req.user
    const {user_id,community_id}=await getUserCommunityId(username,comm_name)
    if(role=="Member"){
        throw new ApiError(401,"User is not privileged to perform operation")
    }
    //update about
    try{
        await con.execute(`update kollege.Community set about=? where community_id=?`,[new_about,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community about updated successfully",{})
    )
} )

const updateCommunityDescription=asyncHandler(async (req,res)=>{
    const {comm_name,new_description}=req.body
    const {username,role}=req.user
    const {user_id,community_id}=await getUserCommunityId(username,comm_name)
    if(role=="Member"){
        throw new ApiError(401,"User is not privileged to perform operation")
    }
    //update description
    try{
        await con.execute(`update kollege.Community set description=? where community_id=?`,[new_description,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community description updated successfully",{})
    )
} )

const updatePrivilege=asyncHandler(async (req,res)=>{
    let rows,fields;
    const {comm_name,updated_username,updated_role}=req.body
    const {username,role}=req.user
    let {user_id,community_id}=await getUserCommunityId(updated_username,comm_name)
    if(username==updated_username){
        throw new ApiError(401,"Cannot update own privilege")
    }
    if(role=="Member" || (role=="Moderator" && updated_role=="Admin")){
        throw new ApiError(401,"User does not have the privilege to perform the operation")
    }

    //check if user being updated exists in the community or not
    try{
        [rows,fields]=await con.execute(`select user_id,role from kollege.User_has_Community where user_id=? and community_id=?`,[user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    if(rows.length<1){
        throw new ApiError(401,"User is not member of given communiy or the user does not exists")
    }
    if(updated_role==rows[0].role){
        throw new ApiError(401,"User is already on the updated role so cannot update it again")
    }
    //update privilege
    try{
        [rows,fields]=await con.execute(`update kollege.User_has_Community set role=? where user_id=? and community_id=?`,[updated_role,user_id,community_id])
    }
    catch(err){
        throw new ApiError(401,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"User privileges updated successfully")
    )
} )

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
            "communities": (page<1)?rows:rows.slice(page * 6 - 6, page * 6)
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
            "communities": (page<1)?rows:rows.slice(page * 6 - 6, page * 6)
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
    [rows,fields]=await con.execute(` select c.comm_name ,c.fullname  ,c.banner_url, c.about , c.type , c.description ,(select count(*) from kollege.User_has_Community b where b.community_id=c.community_id) as total_members ,u.username ,u.firstname ,u.lastname ,u.avatar_url from kollege.Community c inner join kollege.User u on c.owner=u.user_id where comm_name=?; `,[comm_name])
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

const getCommunityRoles=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name}=req.params
    const {username}=req.user
    const {user_id,community_id}=await getUserCommunityId(username,comm_name)
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
    if(role=="Member"){
        throw new ApiError(401,"User does not have acces to this route")
    }
    let query="";
    if(role=="Moderator"){
        query=`and uhc.role!="Admin"`
    }
    try{
        [rows,fields]=await con.execute(`select u.username,u.firstname,u.lastname,u.avatar_url,uhc.role from kollege.User u inner join kollege.User_has_Community uhc on u.user_id =uhc.user_id inner join kollege.Community c on c.community_id=uhc.community_id where uhc.community_id=? and u.user_id!=c.owner and u.user_id!=? ${query}`,[community_id,user_id])
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community members fetched successfully",rows)
    )
})

const getCommunityRequests=asyncHandler(async(req,res)=>{
    let rows,fields;
    const {comm_name}=req.params
    const {username}=req.user
    const {user_id,community_id}=await getUserCommunityId(username,comm_name)
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
    if(role=="Member"){
        throw new ApiError(401,"User does not have acces to this route")
    }
    try{
        [rows,fields]=await con.execute(`select u.username,u.firstname,u.lastname,u.avatar_url from kollege.User u inner join kollege.Community_Requests cr on u.user_id =cr.user_id where cr.community_id=?`,[community_id])
    }
    catch(err){
        throw new ApiError(201,err.message)
    }
    res.status(201).json(
        new ApiResponse(201,"Community requests fetched successfully",rows)
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
    getCommunityRoles,
    getCommunityMembers,
    getCommunityRequests,
    joinCommunity,
    leaveCommunity,
    cancelJoinRequest,
    acceptJoinRequest,
    updatePrivilege,
    updateCommunityName,
    updateCommunityFullname,
    updateCommunityAbout,
    updateCommunityDescription
}
