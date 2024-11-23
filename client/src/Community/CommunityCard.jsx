import React from 'react'
import { useNavigate } from 'react-router'
import { useUserStore } from '../store'

function CommunityCard({community,flag}) {
  const user=useUserStore(state=>state.user)
  const navigate=useNavigate()

  return (
    <div onClick={()=>{
      if(!user.username || flag){
        navigate(`/c/${community.comm_name}/about`)
      }
      else{
        navigate(`/c/${community.comm_name}`)
      }
    }}
    
     className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer">
                {(community.banner_url)?<img
                  src={community.banner_url}
                  alt={`${community.fullname} banner`} 
                  width={400} 
                  height={200} 
                  className="w-full h-32 object-cover"
                />:<img
                src="https://g-p1v8sxx1jj4.vusercontent.net/placeholder.svg?height=100&width=200" 
                alt={`${community.fullname} banner`} 
                width={400} 
                height={200} 
                className="w-full h-32 object-cover"
                />
                }
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-200 text-lg font-semibold">{community.fullname}</h3>
                    <p className='text-slate-900 bg-slate-200 rounded-2xl px-2 py-1 font-semibold text-xs hover:bg-gray-300' >{community.type}</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{community.about}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">{community.total_members.toLocaleString()} members</span>
                    {(!community.joined)?<button size="sm" className=" text-slate-200 bg-slate-900 px-3 py-2 rounded-lg hover:bg-slate-950 ">Join</button>:<></> }
                  </div>
                </div>
              </div>
  )
}

export default CommunityCard
