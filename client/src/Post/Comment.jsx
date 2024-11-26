import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store'
import axios from 'axios';


function Comment({comment,handleCommentDelete,setComments,comm_name}) {

    const user=useUserStore(state=>state.user)

    let [commentLike,setCommentLike]=useState(comment.likes)

    const handleCommentLike=()=>{
        if(!comment.has_liked){
          axios.post("http://localhost:8080/l/comment_like",{comm_name,comment_id:comment.comment_id},{withCredentials:true})
          .then( ({data})=>{
            if(data.success){
            setCommentLike(prev=>prev+1)
              setComments( (prev)=>{
                console.log("hi")
                let newComments=[...prev]
                return newComments.map( (value)=>{
                  if(value.comment_id==comment.comment_id){
                    value.likes+=1
                    value.has_liked=1
                  }
                  return value
                } )
              } )
            }
            else{
              throw Error(data.message);
            }
          } )
          .catch( ({response})=>{
            console.log(response.data.message)
          } )
        }
        else{
          axios.patch("http://localhost:8080/l/comment_like",{comm_name,comment_id:comment.comment_id},{withCredentials:true})
          .then( ({data})=>{
            if(data.success){
                setCommentLike(prev=>prev-1)
              setComments( (prev)=>{
                let newComments=[...prev]
                return newComments.map( (value)=>{
                  if(value.comment_id==comment.comment_id){
                    value.likes-=1
                    value.has_liked=0
                  }
                  return value
                } )
              } )
            }
            else{
              console.log(data.message)
              throw Error(data.message);
            }
          } )
          .catch( ({response})=>{
            console.log(response.data.message)
          } )
        }
      }

  return (
    <div className="flex space-x-3">
        {(comment?.avatar_url)?<img src={comment?.avatar_url} alt={`${comment?.firstname}'s avatar`} className="rounded-full" />:
        <div className='ml-5 font-medium h-fit text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full' >{comment?.firstname[0]}</div>}
        <div className="flex-1">
            <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                    <span className="font-semibold">{comment?.firstname+" "+comment?.lastname}</span>
                    <span className="text-xs text-gray-400">{ (new Date(comment?.commented_on)).toDateString() }</span>
                </div>
                <p className="text-sm mt-1">{comment?.comment}</p>
            </div>
            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-400">
                <button onClick={handleCommentLike} className="hover:text-white">{comment.has_liked? "Remove like": "Like"}</button>
                <span>·</span>
                <button className="hover:text-white">Reply</button>
                <span>·</span>
                { user.username==comment.username && <>
                <button onClick={()=>handleCommentDelete(comment.comment_id)} className="hover:text-white">Delete</button>
                <span>·</span> </> }
                <span>{commentLike} likes</span>
                <>
                    <span>·</span>
                    <button 
                    className="hover:text-white"
                    > Replies
                    </button>
                </>
            </div>

            {/* Replies */}
            {/* {comment.replies.length > 0 && ( */}
                <div className="mt-3 space-y-3">
                {/* {comment.replies.map((reply) => ( */}
                    <div key={1} className="flex space-x-3 bg-gray-600 rounded-lg p-3">
                    {/* <img src={reply.avatar} alt={`${reply.author}'s avatar`} className="w-6 h-6 rounded-full" /> */}
                        <div className='ml-5 font-medium h-fit text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full' >{"T"}</div>
                        <div className='w-full'>
                            <div className="flex justify-between items-center ">
                                <span className="font-semibold text-sm">{"Ali Bilal"}</span>
                                <span className="text-xs text-gray-400">{"24 Dec 2024"}</span>
                            </div>
                            <p className="text-sm mt-1">{"comment"}</p>
                            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                            <button className="hover:text-white">Like</button>
                            <span>·</span>
                            <span>{6} likes</span>
                            </div>
                        </div>
                    </div>
                {/* ))} */}
                </div>
            {/* )} */}

        </div>
    </div>
  )
}

export default Comment