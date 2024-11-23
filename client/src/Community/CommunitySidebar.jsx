import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, } from 'react-router'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store'
import { toast } from 'react-toastify'

function CommunitySidebar() {

  const user=useUserStore(state=>state.user)
  const navigate=useNavigate()

  const [community,setCommunity]=useState({})
  let [userCommunityInfo,setUserCommunityInfo]=useState({})
  const {comm_name}=useParams()

  const handleCancel=()=>{
    axios.post("http://localhost:8080/c/cancel_join_request",{
      comm_name
    },{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setUserCommunityInfo({...userCommunityInfo,membership:0})
        toast.success("Request cancelled successfully")
      }
      else{
        throw new Error(data.message)
      }
    } )
    .catch(err=>toast.error(err.message))
  }

  const handleJoin=()=>{
    axios.post("http://localhost:8080/c/join_community",{
      comm_name
    },{withCredentials: true})
    .then( ({data}) =>{
      if(data.success){
        if(data.data.type=="Private"){
          setUserCommunityInfo({...userCommunityInfo,membership:1})
          toast.success("Community join request submitted successfully")
        }
        else{
          setUserCommunityInfo({...userCommunityInfo,membership:2})
          navigate(`/c/${comm_name}`)
        }
      }
      else{
        toast.error(err.message)
      }
    } )
    .catch(err=>console.log(err.message))
    console.log(userCommunityInfo.membership)
  }

  useEffect(()=>{
    axios.get(`http://localhost:8080/c/${comm_name}/get_community_card_info`)
    .then(({data})=>{
      setCommunity(data.data)
    })
    .catch((err)=>{
      console.log(err.message)
    })

    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setUserCommunityInfo(data.data)
        console.log(data)
      }
    } )
    
  },[])

  return (
    <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img src={community.banner_url?community.banner_url: "https://via.placeholder.com/400x200"} alt="Community banner" className="w-full h-32 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{community.fullname}</h2>
                <p className="text-gray-400 mb-4">{community.about}</p>
                {/* <div className="space-y-2">
                  <a href="#" className="flex items-center text-blue-400 hover:text-blue-300">
                    🔗 Join Data Freelancer
                  </a>
                  <a href="#" className="flex items-center text-blue-400 hover:text-blue-300">
                    🛠 Build Your Community
                  </a>
                  <a href="#" className="flex items-center text-blue-400 hover:text-blue-300">
                    🚀 Get GenAI Launchpad
                  </a>
                </div> */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{community.total_members}</div>
                      <div className="text-gray-400 text-sm">Members</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{community.moderator_count}</div>
                      <div className="text-gray-400 text-sm">Moderators</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{community.admin_count}</div>
                      <div className="text-gray-400 text-sm">Admins</div>
                    </div>
                  </div>
                </div>
                {
                  user?.username
                  ? ( userCommunityInfo?.membership==0
                    ? <button onClick={handleJoin} className='bg-slate-900 hover:bg-slate-950 w-full rounded-lg mt-6 py-2 text-lg' >Join now</button>
                    : ( userCommunityInfo?.membership==1 
                      ? <button onClick={handleCancel} className='bg-slate-900 hover:bg-slate-950 w-full rounded-lg mt-6 py-2 text-lg' >Cancel Request</button>
                      : <Link to={`/c/${comm_name}/settings`} > <button className='bg-slate-900 hover:bg-slate-950 w-full rounded-lg mt-6 py-2 text-lg' >Settings</button> </Link>
                     ) ) 
                  : <button onClick={()=>navigate("/login")} className='bg-slate-900 hover:bg-slate-950 w-full rounded-lg mt-6 py-2 text-lg' >Join now</button>
                }
              </div>
            </div>
          </div>
  )
}

<button className='bg-slate-900 hover:bg-slate-950 w-full rounded-lg mt-6 py-2 text-lg' >Join now</button>

export default CommunitySidebar