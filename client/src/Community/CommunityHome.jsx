
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router';
import PostModal from '../Post/PostModal';
import PostCreationForm from '../Post/PostCreationForm';
import axios from 'axios';
import PostCard from '../Post/PostCard';
import CommunitySidebar from './CommunitySidebar'
import { useUserStore } from '../store';


function CommunityHome() {

  const avatar_url=useUserStore(state=>state.user.avatar_url)
  const username=useUserStore(state=>state.user.username)
  console.log(avatar_url)

  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [tags,setTags]=useState([])
  let [posts,setPosts]=useState([])
  let [event,setEvent]=useState(null)
  const {comm_name}=useParams()

  const handlePostCreation=(post)=>{
    setPosts([post,...posts])
  }

  const handleTagFilter=(tag_name)=>{
    axios.get(`http://localhost:8080/p/${comm_name}/?tag_name=${tag_name}`,{withCredentials:true})
    .then( ({data})=>{
      if(data.success){
        setPosts(data?.data)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>console.log(err.message))
  }

  const handleUpdate=(post_id,likes,comments)=>{
    setPosts((prev)=>{
      let newPosts=[...prev]
      return newPosts.map( (post)=>{
        if(post.post_id==post_id){
          if(likes){
            post.likes=likes
          }
          if(comments){
            post.comments=comments
          }
        }
        return post;
      } )
    })
  }

  useEffect(()=>{

    //get tags
    axios.get(`http://localhost:8080/t/${comm_name}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setTags(data?.data)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>console.log(err.message))

    //get posts
    axios.get(`http://localhost:8080/p/${comm_name}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setPosts(data?.data)
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>console.log(err.message))

    //get event
    axios.get(`http://localhost:8080/e/${comm_name}`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setEvent(data?.data[0])
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(({response})=>{
      console.log(response?.message)
    })

  },[])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <>

      {/* Post Model  */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={selectedPost}
          onClose={() => setSelectedPost(null)}
          comm_name={comm_name}
          handleUpdate={handleUpdate}
        />
      )}

      {/* Post Creation Form  */}
      {isPostFormOpen && (
        <PostCreationForm 
        comm_name={comm_name}
        tags={tags}
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        handlePostCreation={handlePostCreation}
        />
      )}
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Input */}
            <div onClick={() => setIsPostFormOpen(true)} className="cursor-pointer bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-4">
              {(avatar_url)?<img src={` http://localhost:8080/images/${avatar_url} `} alt={`${username}'s avatar`} className="w-10 h-10 rounded-full" />:
                  <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full' >{username[0]}</div>}
                 
                <div
                  placeholder="Write something"
                  className="bg-slate-700 text-slate-300 rounded-lg px-4 py-2 w-full "
                >Write something</div>
              </div>
            </div>

            {/* Upcoming Event */}
            {event && <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-center">
                📅 {event?.title} is happening in { Math.floor(((new Date(event?.start)).getTime() - (new Date()).getTime())/3600000)  } hours
              </p>
            </div>}

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-4">
            <button key={0} onClick={()=>handleTagFilter("All")} className="bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-full text-slate-200 font-medium">All</button>
              {tags.map( tag=>{
                return <button key={tag.tag_id} onClick={()=>handleTagFilter(tag.tag_name)} className="bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-full text-slate-200 font-medium">{tag.tag_name}</button>
              } )}
            </div>

            {/* Posts */}
            {
              posts.map( post=>{
                return <PostCard post={post} key={post.post_id} handleClick={() => setSelectedPost(post)} />
              } )
            }
          </div>

    </>
    <CommunitySidebar />
        </div>
      </div>
    </div>
  )
}

export default CommunityHome
