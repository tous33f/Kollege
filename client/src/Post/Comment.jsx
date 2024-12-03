import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store'
import axios from 'axios';
import Reply from './Reply';
import { toast } from 'react-toastify';

function Comment({comment,handleCommentDelete,setComments,comm_name,handleReplyButton}) {

    const user=useUserStore(state=>state.user)

    let [commentLike,setCommentLike]=useState(comment.likes)
    let [replies,setReplies]=useState([])
    let [reply,setReply]=useState(false)

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
          .catch(({response})=>{
            toast.error(response?.data?.message)
          })
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
          .catch(({response})=>{
            toast.error(response?.data?.message)
          })
        }
      }

    const handleReplies=()=>{
      axios.get(`http://localhost:8080/rc/${comm_name}/${comment.comment_id}`,{withCredentials:true})
      .then( ({data})=>{
        if(data.success){
          setReplies([...data?.data])
          setReply(true)
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(({response})=>{
        toast.error(response?.data?.message)
      })
    }

    const handleReplyDelete=(reply_id)=>{
      axios.patch(`http://localhost:8080/rc/reply`,{
        comm_name,reply_id
      },{withCredentials:true})
      .then( ({data})=>{
        if(data.success){
          setReply(false)
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(({response})=>{
        toast.error(response?.data?.message)
      })
    }

  return (
    <div className="flex space-x-3">
        {(comment?.avatar_url)?<img src={` http://localhost:8080/images/${comment?.avatar_url} `} alt={`${comment?.firstname}'s avatar`} className="h-10 w-10 rounded-full" />:
        <div className='ml-5 font-medium h-fit text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full' >{comment?.firstname[0]}</div>}
        <div className="flex-1">
            <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                    <span className="font-semibold">{comment?.firstname+" "+comment?.lastname}</span>
                    <span className="text-xs text-gray-400">{ new Date(comment.commented_on).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }</span>
                </div>
                <p className="text-sm mt-1">{comment?.comment}</p>
            </div>
            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-400">
                <button onClick={handleCommentLike} className="hover:text-white">{comment.has_liked? "Remove like": "Like"}</button>
                <span>·</span>
                <button onClick={handleReplyButton} className="hover:text-white">Reply</button>
                <span>·</span>
                { user.username==comment.username && <>
                <button onClick={()=>handleCommentDelete(comment.comment_id)} className="hover:text-white">Delete</button>
                <span>·</span> </> }
                <span>{commentLike} likes</span>
                {
                  !reply ?
                  <>
                    <span>·</span>
                    <button onClick={handleReplies}
                    className="hover:text-white"
                    > Show Replies
                    </button>
                  </> :
                  <>
                  <span>·</span>
                  <button onClick={()=>{
                    setReply(false)
                    setReplies([])
                  }}
                  className="hover:text-white"
                  > Hide Replies
                  </button>
                  </>
                }
            </div>

            {/* Replies */}
              <div className="mt-1 space-y-3">
                    { reply &&
                      replies.map((val)=>{
                        return <Reply handleReplyDelete={()=>handleReplyDelete(val.reply_id)} reply={val} />
                      })
                    }
              </div>

        </div>
    </div>
  )
}

export default Comment