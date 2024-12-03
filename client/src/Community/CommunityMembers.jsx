import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import CommunitySidebar from './CommunitySidebar'

function CommunityMembers() {

    let [admins,setAdmins]=useState([])
    let [moderators,setModerators]=useState([])
    let [members,setMembers]=useState([])
    let {comm_name}=useParams()

    useEffect(()=>{
        axios.get(`http://localhost:8080/c/${comm_name}/get_community_members`,{withCredentials: true})
        .then( ({data})=>{
            if(data.success){
                setAdmins(data.data.admins)
                setModerators(data.data.moderators)
                setMembers(data.data.members)
            }
            else{
                throw new Error(data?.data?.message)
            }
        } )
        .catch( ({response})=>{
            toast.error(response?.data?.message)
        } )
    },[])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className='lg:col-span-2 space-y-6 text-slate-200'>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Admins</h2>
            { admins.map( (admin,index)=>{
                return  <div key={admin.username} className='flex items-center justify-start space-x-4 cursor-pointer bg-slate-800 rounded-lg p-4 w-full mb-6' >
                    { admin?.avatar_url ? 
                    <img src={` http://localhost:8080/images/${admin?.avatar_url} `} alt={`${admin.firstname}'s avatar`} className='h-11 ml-5 rounded-full' /> :
                    <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{admin.firstname[0]}</div>
                    }
                    <div className='flex-col' >
                        <p className='text-slate-200 text-lg font-semibold' > {admin.firstname+" "+admin.lastname} </p>
                        <p className='' > @{admin.username} </p>
                    </div>
                </div> 
            } ) }
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Moderators</h2>
            { moderators.map( (moderator,index)=>{
                return  <div key={moderator.username} className='flex items-center justify-start space-x-4 cursor-pointer bg-slate-800 rounded-lg p-4 w-full mb-6' >
                    { moderator?.avatar_url ? 
                    <img src={` http://localhost:8080/images/${moderator?.avatar_url} `} alt={`${moderator.firstname}'s avatar`} className='h-11 ml-5 rounded-full' /> :
                    <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{moderator.firstname[0]}</div>
                    }
                    <div className='flex-col' >
                        <p className='text-slate-200 text-lg font-semibold' > {moderator.firstname+" "+moderator.lastname} </p>
                        <p className='' > @{moderator.username} </p>
                    </div>
                </div> 
            } ) }
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Members</h2>
            { members.map( (member,index)=>{
                return  <div key={member.username} className='flex items-center justify-start space-x-4 cursor-pointer bg-slate-800 rounded-lg p-4 w-full mb-6' >
                    { member?.avatar_url ? 
                    <img src={` http://localhost:8080/images/${member?.avatar_url} `} alt={`${member.firstname}'s avatar`} className='h-11 ml-5 rounded-full' /> :
                    <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{member.firstname[0]}</div>
                    }
                    <div className='flex-col' >
                        <p className='text-slate-200 text-lg font-semibold' > {member.firstname+" "+member.lastname} </p>
                        <p className='' > @{member.username} </p>
                    </div>
                </div> 
            } ) }
        </div>
        
    </div>
    
    <CommunitySidebar />
        </div>
      </div>
    </div>
  )
}

export default CommunityMembers