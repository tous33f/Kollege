import React, { useEffect, useState } from 'react';
import CommunitySettingsNavbar from './CommunitySettingsNavbar';
import { useParams,Outlet, useNavigate } from 'react-router';
import axios from 'axios';
import { useUserStore } from '../../store';
import { toast } from 'react-toastify';

export default function CommunitySettingsMain() {

  let [userCommunityInfo,setUserCommunityInfo]=useState({})
  let [communityOwner,setCommunityOwner]=useState('')
  let user=useUserStore(state=>state.user)
  const {comm_name}=useParams()
  let navigate=useNavigate()

  const handleRemoval=()=>{
    axios.post(`http://localhost:8080/c/leave_community`,{comm_name},{withCredentials:true})
    .then( ({data})=>{
        if(data.success){
          navigate(`/c/${comm_name}/about`)
        }
        else{
            throw new Error(data.message)
        }
    } )
    .catch(err=>console.log(err.message))
  }
  
  useEffect(()=>{

    axios.get(`http://localhost:8080/c/${comm_name}/user_community_info`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setUserCommunityInfo(data.data)
      }
      else{
        throw new Error(data?.data?.message)
      }
    })
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })

    axios.get(`http://localhost:8080/c/${comm_name}/get_community_about`,{withCredentials: true})
    .then( ({data})=>{
      if(data.success){
        setCommunityOwner(data?.data?.username)
      }
      else{
        throw new Error(data?.data?.message)
      }
    })
    .catch(({response})=>{
      toast.error(response?.data?.message)
    })

  },[])

  return (
    <>

      <div className="min-h-screen bg-slate-900 text-slate-200 max-w-4xl mx-auto mt-8 px-4">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Community Settings</h1>
          <button
            onClick={() => navigate(`/c/${comm_name}/`,{replace:true})}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Community
          </button>
        </div>

        {
          (userCommunityInfo?.info?.role=="Admin" || userCommunityInfo?.info?.role=="Moderator") && 
          <>
          <CommunitySettingsNavbar />
          <Outlet />
          </>
        }
        <div className="mt-6 mb-8 pt-6 border-t border-slate-700"> 
        {user?.username!=communityOwner && 
          <button onClick={handleRemoval} className="px-4 py-2 bg-red-600 text-slate-200 font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Leave Community
          </button>}
        </div>
      </div>

    </>
  );
}