import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Comment from './Comment'; 

export default function PostModal({ post, onClose, isOpen,comm_name,handleUpdate }) {
  
  const modalRef=useRef(null)
  const commentRef=useRef(null)

  let [likes,setLikes]=useState(0);
  let [hasLiked,setHasLiked]=useState(false);
  let [comments,setComments]=useState([])
  let [commentInput,setCommentInput]=useState("")
  let [replyName,setReplyName]=useState("")
  let [replyId,setReplyId]=useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      document.body.style.overflow = 'hidden';
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    //requests
    //likes
    axios.get(`http://localhost:8080/l/${comm_name}/${post.post_id}`,{withCredentials:true})
    .then( ({data})=>{
      if(data.success){
        setLikes(data?.data?.likes)
        setHasLiked(data?.data?.user_has_liked)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>{
      console.log(err.message)
      onClose()
    })
    //comments
    axios.get(`http://localhost:8080/r/${comm_name}/${post.post_id}`,{withCredentials:true})
    .then( ({data})=>{
      if(data.success){
        setComments(data?.data)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>{
      console.log(err.message)
      onClose()
    })


    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };

  }, [isOpen, onClose]);

  const handleLike=()=>{

    if(hasLiked){
      axios.patch(`http://localhost:8080/l/like`,
      {comm_name,post_id:post.post_id},
      {withCredentials:true})
      .then( ({data})=>{
        if(data.success){
          setHasLiked(false)
          setLikes(prev=>{
            handleUpdate(post.post_id,prev-1,null)
            return prev-1
          })
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(err=>{
        console.log(err.message)
      })
      return;
    }

    else{
      axios.post(`http://localhost:8080/l/like`,
      {comm_name,post_id:post.post_id},
      {withCredentials:true})
      .then( ({data})=>{
        setHasLiked(true)
        if(data.success){
          setLikes(prev=>{
            handleUpdate(post.post_id,prev+1,null)
              return prev+1
          })
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(err=>{
        console.log(err.message)
      })
    }

  }

  const handleCommentSubmit=()=>{
    axios.post(`http://localhost:8080/r/comment`,
      {comm_name,post_id:post.post_id,comment:commentInput},
      {withCredentials:true})
      .then( ({data})=>{
        if(data.success){
          setCommentInput("")
          console.log(data?.data)
          setComments(prev=>{
            handleUpdate(post.post_id,null,comments.length+1)
            return [data?.data,...prev]
          })
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(err=>{
        console.log(err.message)
      })
  }

  const handleCommentDelete=(comment_id)=>{
    axios.patch(`http://localhost:8080/r/comment`,
      {comm_name,post_id:post.post_id,comment_id},
      {withCredentials:true})
      .then( ({data})=>{
        if(data.success){
          setComments(prev=>{
            handleUpdate(post.post_id,null,comments.length-1)
            let newComments=[...comments];
            newComments.map( val=>{
              if(val.comment_id!=comment_id){
                return val
              }
            } )
            return newComments;
          })
        }
        else{
          throw new Error(data.message)
        }
      } )
      .catch(err=>{
        console.log(err.message)
      })
  }

  const handleReplySubmit=()=>{
    axios.post(`http://localhost:8080/rc/reply`,{
      comm_name,comment_id:replyId,comment:commentInput
    },{withCredentials:true})
    .then( ({data})=>{
      if(data.success){
        setCommentInput("")
        setReplyName("")
        setReplyId(null)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      console.log(response?.data?.message)
    })
  }

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto ">
      <div ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {post?.avatar_url?<img 
              src={` http://localhost:8080/images/${post.avatar_url} `} 
              alt={`${post.firstname}'s avatar`}
              className="w-10 h-10 rounded-full"
            />:
            <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{post.firstname[0]}</div>}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{post.firstname + " " + post.lastname}</h3>
                <span className="text-gray-400 text-sm">{ new Date(post.created_on).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }</span>
                <span className="text-gray-400">in</span>
                <span className="text-blue-400">{post.tag_name}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
          
          {post.graphics_url && (
            <div className="mt-4">
              <img
                src={` http://localhost:8080/images/${post.graphics_url} `} 
                alt="Post attachment" 
                className="rounded-lg max-h-[400px] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button onClick={handleLike} className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg px-4 py-2 ">
                <span> {hasLiked ? <>👍</> : <>👍🏻</> } </span>
                <span>{likes}</span>
              </button>
              <button onClick={()=>commentRef.current.focus()} className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg px-4 py-2">
                <span>💬</span>
                <span>{ comments.length }</span>
              </button>
            </div>
          </div>
        </div>

          {/* Comments Section */}
        <div className="border-t border-gray-700 p-4">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment key={comment.comment_id} 
              comment={comment}
              comm_name={comm_name}
              handleCommentDelete={handleCommentDelete}
              setComments={setComments}
              handleReplyButton={()=>{
                setReplyId(comment.comment_id)
                setReplyName(comment?.firstname+" "+comment?.lastname)
              }} />
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
        {replyId && (
            <div className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded-md">
              <span className="text-sm text-gray-300">
                Replying to {replyName}
              </span>
              <button onClick={()=>{
                setReplyName("")
                setReplyId(null)
              }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex space-x-2">
            <input ref={commentRef}
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e)=>setCommentInput(e.target.value)}
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={replyId?handleReplySubmit:handleCommentSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Post
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}