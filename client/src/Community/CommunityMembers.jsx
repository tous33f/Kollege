import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import CommunitySidebar from './CommunitySidebar'
import { useUserStore } from '../store'

function CommunityMembers() {

    let user=useUserStore(state=>state?.user)
    let [admins,setAdmins]=useState([])
    let [moderators,setModerators]=useState([])
    let [members,setMembers]=useState([])
    let {comm_name}=useParams()

    let navigate=useNavigate()

    const handleMessageClick=(user)=>{
        navigate("/chat",{state: {user}})
    }

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
    <div className="md:min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className='lg:col-span-2 space-y-6 text-slate-200'>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Admins</h2>
            { admins.map( (admin,index)=>{
                return  <div key={admin.username} className=' flex justify-between items-center bg-slate-800 rounded-lg p-4 w-full mb-6' >
                    <div className=' flex items-center justify-start space-x-4 cursor-pointer ' >
                        { admin?.avatar_url ? 
                        <img src={` http://localhost:8080/images/${admin?.avatar_url} `} alt={`${admin.firstname}'s avatar`} className='h-11 ml-5 rounded-full' /> :
                        <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{admin.firstname[0]}</div>
                        }
                        <div className='flex-col' >
                            <p className='text-slate-200 text-lg font-semibold' > {admin.firstname+" "+admin.lastname} </p>
                            <p className='' > @{admin.username} </p>
                        </div>
                    </div>
                    { admin?.username!=user?.username && <div className='mr-5 cursor-pointer ' onClick={()=>handleMessageClick(admin)} >
                        <svg fill="#e1e8f0" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 458 458" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M428,41.534H30c-16.569,0-30,13.431-30,30v252c0,16.568,13.432,30,30,30h132.1l43.942,52.243 c5.7,6.777,14.103,10.69,22.959,10.69c8.856,0,17.258-3.912,22.959-10.69l43.942-52.243H428c16.568,0,30-13.432,30-30v-252 C458,54.965,444.568,41.534,428,41.534z M323.916,281.534H82.854c-8.284,0-15-6.716-15-15s6.716-15,15-15h241.062 c8.284,0,15,6.716,15,15S332.2,281.534,323.916,281.534z M67.854,198.755c0-8.284,6.716-15,15-15h185.103c8.284,0,15,6.716,15,15 s-6.716,15-15,15H82.854C74.57,213.755,67.854,207.039,67.854,198.755z M375.146,145.974H82.854c-8.284,0-15-6.716-15-15 s6.716-15,15-15h292.291c8.284,0,15,6.716,15,15C390.146,139.258,383.43,145.974,375.146,145.974z"></path> </g> </g> </g></svg>
                    </div>}
                </div> 
            } ) }
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Moderators</h2>
            { moderators.map( (moderator,index)=>{
                return <div key={moderator.username} className=' flex justify-between items-center bg-slate-800 rounded-lg p-4 w-full mb-6' >
                <div className=' flex items-center justify-start space-x-4 cursor-pointer ' >
                    { moderator?.avatar_url ? 
                    <img src={` http://localhost:8080/images/${moderator?.avatar_url} `} alt={`${moderator.firstname}'s avatar`} className='h-11 ml-5 rounded-full' /> :
                    <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{moderator.firstname[0]}</div>
                    }
                    <div className='flex-col' >
                        <p className='text-slate-200 text-lg font-semibold' > {moderator.firstname+" "+moderator.lastname} </p>
                        <p className='' > @{moderator.username} </p>
                    </div>
                </div>
                { moderator?.username!=user?.username && <div className='mr-5 cursor-pointer ' onClick={()=>handleMessageClick(moderator)} >
                    <svg fill="#e1e8f0" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 458 458" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M428,41.534H30c-16.569,0-30,13.431-30,30v252c0,16.568,13.432,30,30,30h132.1l43.942,52.243 c5.7,6.777,14.103,10.69,22.959,10.69c8.856,0,17.258-3.912,22.959-10.69l43.942-52.243H428c16.568,0,30-13.432,30-30v-252 C458,54.965,444.568,41.534,428,41.534z M323.916,281.534H82.854c-8.284,0-15-6.716-15-15s6.716-15,15-15h241.062 c8.284,0,15,6.716,15,15S332.2,281.534,323.916,281.534z M67.854,198.755c0-8.284,6.716-15,15-15h185.103c8.284,0,15,6.716,15,15 s-6.716,15-15,15H82.854C74.57,213.755,67.854,207.039,67.854,198.755z M375.146,145.974H82.854c-8.284,0-15-6.716-15-15 s6.716-15,15-15h292.291c8.284,0,15,6.716,15,15C390.146,139.258,383.43,145.974,375.146,145.974z"></path> </g> </g> </g></svg>
                </div>}
            </div> 
            } ) }
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">Members</h2>
            { members.map( (member,index)=>{
                return <div key={member.username} className=' flex justify-between items-center bg-slate-800 rounded-lg p-4 w-full mb-6' >
                <div className=' flex items-center justify-start space-x-4 cursor-pointer ' >
                    { member?.avatar_url ? 
                    <img src={` http://localhost:8080/images/${member?.avatar_url} `} alt={`${member.firstname}'s avatar`} className='h-11 ml-5 rounded-full' /> :
                    <div className='ml-5 font-medium text-xl cursor-pointer bg-slate-900  px-4 py-2 rounded-full'  >{member.firstname[0]}</div>
                    }
                    <div className='flex-col' >
                        <p className='text-slate-200 text-lg font-semibold' > {member.firstname+" "+member.lastname} </p>
                        <p className='' > @{member.username} </p>
                    </div>
                </div>
                { member?.username!=user?.username && <div className='mr-5 cursor-pointer ' onClick={()=>handleMessageClick(member)} >
                    <svg fill="#e1e8f0" height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 458 458" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M428,41.534H30c-16.569,0-30,13.431-30,30v252c0,16.568,13.432,30,30,30h132.1l43.942,52.243 c5.7,6.777,14.103,10.69,22.959,10.69c8.856,0,17.258-3.912,22.959-10.69l43.942-52.243H428c16.568,0,30-13.432,30-30v-252 C458,54.965,444.568,41.534,428,41.534z M323.916,281.534H82.854c-8.284,0-15-6.716-15-15s6.716-15,15-15h241.062 c8.284,0,15,6.716,15,15S332.2,281.534,323.916,281.534z M67.854,198.755c0-8.284,6.716-15,15-15h185.103c8.284,0,15,6.716,15,15 s-6.716,15-15,15H82.854C74.57,213.755,67.854,207.039,67.854,198.755z M375.146,145.974H82.854c-8.284,0-15-6.716-15-15 s6.716-15,15-15h292.291c8.284,0,15,6.716,15,15C390.146,139.258,383.43,145.974,375.146,145.974z"></path> </g> </g> </g></svg>
                </div>}
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